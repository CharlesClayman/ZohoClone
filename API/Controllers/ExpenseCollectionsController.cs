using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ExpenseCollectionsController:BaseApiController
    {
        private readonly IRepository<Expenses, Guid> _expensesRepository;
        private readonly IMapper _mapper;

        public ExpenseCollectionsController(IRepository<Expenses, Guid> expensesRepository, IMapper mapper)
        {
            _expensesRepository = expensesRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBulkExpense([FromBody] IEnumerable<ExpenseCreationDto> expenses)
        {
            if (expenses == null)
                return BadRequest();

            var expenseEntities = _mapper.Map<IEnumerable<Expenses>>(expenses);

            _expensesRepository.AddRange(expenseEntities);

            await _expensesRepository.SaveChangesAsync();


            var expenseToReturn = _mapper.Map<IEnumerable<ExpenseReturnDto>>(expenseEntities);

           return Ok(expenseToReturn);
        }
    }
}
