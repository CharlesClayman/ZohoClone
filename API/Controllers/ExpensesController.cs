using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

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

            return CreatedAtRoute(nameof(GetExpense),new {expenseId = expenseEntity.Id}, expenseToReturn);
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
            var expense = await _expensesRepository.GetSingleAsync(expenseId);

            return Ok(_mapper.Map<ExpenseReturnDto>(expense));
        }

        [HttpGet]
        public async Task<IActionResult> GetExpenses()
        {
            var users = await _expensesRepository.GetAllAsync();

            if(users == null)
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
            var expenseEntity = await _expensesRepository.GetSingleAsync(expenseId);
            _expensesRepository.Delete(expenseEntity);
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
            var expenseFromRepo = await _expensesRepository.GetSingleAsync(expenseId);

            _mapper.Map(expense,expenseFromRepo);
            _expensesRepository.Update(expenseFromRepo);
            await _expensesRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
