using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class TaxController:BaseApiController
    {
        private readonly IRepository<Tax, Guid> _taxRepository;
        private readonly IMapper _mapper;

        public TaxController(IRepository<Tax, Guid> taxRepository, IMapper mapper)
        {
            _taxRepository = taxRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTerm([FromBody] TaxCreationDto tax)
        {
            var taxEntity = _mapper.Map<Tax>(tax);
            _taxRepository.Add(taxEntity);
            await _taxRepository.SaveChangesAsync();

            var taxToReturn = _mapper.Map<TaxReturnDto>(taxEntity);

            return CreatedAtRoute(nameof(GetTax), new { taxId = taxEntity.Id }, taxToReturn);
        }

        [HttpGet]
        [Route("{taxId}", Name = "GetTax")]
        public async Task<IActionResult> GetTax(Guid taxId)
        {
            var taxExists = await _taxRepository.Exists(taxId);
            if (!taxExists)
            {
                return NotFound();
            }
            var tax = await _taxRepository.GetSingleAsQueryable()
                .Where(x => x.IsDeleted == false)
                .Where(x => x.Id == taxId)
                .FirstOrDefaultAsync(); 

            return Ok(_mapper.Map<TaxReturnDto>(tax));
        }

        [HttpGet]
        public async Task<IActionResult> GetTaxes([FromQuery] TaxQuery query)
        {
            var queryable = _taxRepository.GetAllAsQueryable()
                .Where(x => x.IsDeleted == false);

            if (!string.IsNullOrEmpty(query.searchQuery))
            {
                queryable = queryable.Where(x =>
                x.TaxName.Contains(query.searchQuery)||
                x.TaxRate.ToString().Contains(query.searchQuery)
                ) ;
            }

            var taxes = await queryable.ToListAsync();
            if (taxes == null)
                return NotFound();
            return Ok(_mapper.Map<List<TaxReturnDto>>(taxes));
        }


        [HttpDelete("{taxId}")]
        public async Task<IActionResult> DeleteTax(Guid taxId)
        {
            var taxExists = await _taxRepository.Exists(taxId);
            if (!taxExists)
            {
                return NotFound();
            }

            var taxEntity = await _taxRepository.GetSingle(taxId);
            // _taxRepository.Delete(taxEntity);
            taxEntity.IsDeleted = true;
            await _taxRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{taxId}")]
        public async Task<IActionResult> UpdateTax(Guid taxId, TaxUpdateDto tax)
        {
            var taxExists = await _taxRepository.Exists(taxId);
            if (!taxExists)
            {
                return NotFound();
            }

            var taxFromRepo = await _taxRepository.GetSingle(taxId);
               
            _mapper.Map(tax, taxFromRepo);

            _taxRepository.Update(taxFromRepo);
            await _taxRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
