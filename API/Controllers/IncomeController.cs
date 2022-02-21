using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

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

            var income = await _incomeRepository.GetSingleAsync(incomeId);

            return Ok(_mapper.Map<IncomeReturnDto>(income));
        }

        [HttpGet]
        public async Task<IActionResult> GetIncomes()
        {
            var incomes = await _incomeRepository.GetAllAsync();
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

            var incomeEntity = await _incomeRepository.GetSingleAsync(incomeId);
            _incomeRepository.Delete(incomeEntity);
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

            var incomeFromRepo = await _incomeRepository.GetSingleAsync(incomeId);

            _mapper.Map(income,incomeFromRepo);
            _incomeRepository.Update(incomeFromRepo);
            await _incomeRepository.SaveChangesAsync();

            return NoContent();
        }

    }
}
