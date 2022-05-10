using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class IncomeController : BaseApiController
    {
        private readonly IRepository<Income,Guid> _incomeRepository;
        private readonly IMapper _mapper;

        public IncomeController(IRepository<Income,Guid> incomeRepository, IMapper mapper)
        {
            _incomeRepository = incomeRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddIncome(IncomeCreationDto income)
        {
            if (income == null)
                return BadRequest();

            var incomeEntity = _mapper.Map<Income>(income);
            _incomeRepository.Add(incomeEntity);
            await _incomeRepository.SaveChangesAsync();

            var incomeToReturn = _mapper.Map<IncomeReturnDto>(incomeEntity);

            return CreatedAtRoute(nameof(GetIncome), new { incomeId = incomeEntity.Id }, incomeToReturn);
        }

        [HttpGet]
        [Route("{incomeId}", Name = "GetIncome")]
        public async Task<IActionResult> GetIncome(Guid incomeId)
        {
            var incomeExists = await _incomeRepository.Exists(incomeId);
            if(!incomeExists)
            {
                return NotFound();
            }

            var income = await _incomeRepository.GetSingleAsQueryable()
                .Where(x => x.IsDeleted == false)
                .Include(x => x.Customer)
                .Include(x => x.Invoice)
                .FirstOrDefaultAsync(x=>x.Id==incomeId);

            return Ok(_mapper.Map<IncomeReturnDto>(income));
        }

        [HttpGet]
        public async Task<IActionResult> GetIncomes([FromQuery] IncomeQuery query)
        {
            var queryable = _incomeRepository.GetAllAsQueryable()
                 .Include(x => x.Customer)
                 .Include(x=>x.Invoice)
                 .Where(x => x.IsDeleted == false);

            if (!string.IsNullOrEmpty(query.SearchQuery))
            {
                queryable = queryable.Where(x =>
                x.Customer.FirstName.Contains(query.SearchQuery) ||
                x.Customer.LastName.Contains(query.SearchQuery) ||
                x.Currency.Contains(query.SearchQuery) ||
                x.PaymentDate.ToString().Contains(query.SearchQuery) ||
                x.PaymentMode.Contains(query.SearchQuery) ||
                x.AmountReceived.ToString().Contains(query.SearchQuery)
                );
            }

            var incomes = await queryable.ToListAsync();
    
            if (incomes == null)
                return NotFound();
            return Ok(_mapper.Map<IEnumerable<IncomeReturnDto>>(incomes));
        }

        [HttpDelete("{incomeId}")]
        public async Task<IActionResult> DeleteIncome(Guid incomeId)
        {
            var incomeExists = await _incomeRepository.Exists(incomeId);
            if (!incomeExists)
            {
                NotFound();
            }

            var incomeEntity = await _incomeRepository.GetSingle(incomeId);
            //_incomeRepository.Delete(incomeEntity);
            incomeEntity.IsDeleted = true;
            await _incomeRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{incomeId}")]
        public async Task<IActionResult> UpdateIncome(Guid incomeId, IncomeUpdateDto income)
        {
            var incomeExists = await _incomeRepository.Exists(incomeId);
            if (!incomeExists)
            {
                NotFound();
            }

            var incomeFromRepo = await _incomeRepository.GetSingle(incomeId);

            _mapper.Map(income,incomeFromRepo);
            _incomeRepository.Update(incomeFromRepo);
            await _incomeRepository.SaveChangesAsync();

            return NoContent();
        }

    }
}
