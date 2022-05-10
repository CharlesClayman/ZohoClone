using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ExpensesController : BaseApiController
    {
        private readonly IRepository<Expenses,Guid> _expensesRepository;
        private readonly IMapper _mapper;

        public ExpensesController(IRepository<Expenses,Guid> expensesRepository,IMapper mapper)
        {
            _expensesRepository = expensesRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateExpense([FromBody] ExpenseCreationDto expense)
        {
            if (expense == null)
                return BadRequest();

            var expenseEntity = _mapper.Map<Expenses>(expense);
            _expensesRepository.Add(expenseEntity);
            await _expensesRepository.SaveChangesAsync();

            var expenseToReturn = _mapper.Map<ExpenseReturnDto>(expenseEntity);

            return CreatedAtRoute(nameof(GetExpense), new { expenseId = expenseEntity.Id }, expenseToReturn);
        }


         
        [HttpGet]
        [Route("{expenseId}",Name ="GetExpense")]
        public async Task<IActionResult> GetExpense(Guid expenseId)
        {
           var expenseExists = await _expensesRepository.Exists(expenseId);

            if(!expenseExists)
            {
                return NotFound();
            }
            
            var expense =await  _expensesRepository.GetSingleAsQueryable()
                .Where(x=>x.IsDeleted==false)
                .Include(x=>x.Category)
                .Include(x=>x.Tax)
                .Include(x=>x.Customer)
                .FirstOrDefaultAsync(x=>x.Id ==expenseId);

            return Ok(_mapper.Map<ExpenseReturnDto>(expense));
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses([FromQuery] ExpenseQuery query)
        {
            var queryable = _expensesRepository.GetAllAsQueryable()
               .Include(x => x.Category)
               .Include(x => x.Tax)
               .Include(x => x.Customer)
                .Where(x => x.IsDeleted == false);
               
            if(!string.IsNullOrEmpty(query.searchQuery))
            {
                queryable = queryable.Where(x =>
                x.Category.Name.Contains(query.searchQuery)||
                x.Date.ToString().Contains(query.searchQuery)||
                x.Amount.ToString().Contains(query.searchQuery) ||
                x.Currency.Contains(query.searchQuery));
            }
            
            var users = await queryable.ToListAsync();
            if (users == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<ExpenseReturnDto>>(users));
        }

        [HttpDelete("{expenseId}")]
        public async Task<IActionResult> DeleteExpense(Guid expenseId)
        {
            var expenseExists = await _expensesRepository.Exists(expenseId);
            if(!expenseExists)
            {
                NotFound();
            }
            var expenseEntity = await _expensesRepository.GetSingle(expenseId);
            // _expensesRepository.Delete(expenseEntity);
            expenseEntity.IsDeleted = true;
            await _expensesRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{expenseId}")]
        public async Task<IActionResult> UpdateExpense(Guid expenseId,ExpenseUpdateDto expense)
        {
            var expenseExists = await _expensesRepository.Exists(expenseId);
            if (!expenseExists)
            {
                NotFound();
            }
            var expenseFromRepo = await _expensesRepository.GetSingle(expenseId);

            _mapper.Map(expense,expenseFromRepo);
            _expensesRepository.Update(expenseFromRepo);
            await _expensesRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
