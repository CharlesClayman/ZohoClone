using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class SalePersonController:BaseApiController
    {
        private readonly IRepository<SalesPerson,Guid> _salesPersonRepository;
        private readonly IMapper _mapper;

        public SalePersonController(IRepository<SalesPerson,Guid> salesPersonRepository,IMapper mapper)
        {
            _salesPersonRepository = salesPersonRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateSalesPerson([FromBody]SalesPersonCreationDto salesPerson)
        {
            if (salesPerson == null)
                return BadRequest();
            var salesPersonEntity = _mapper.Map<SalesPerson>(salesPerson);
            _salesPersonRepository.Add(salesPersonEntity);
            await _salesPersonRepository.SaveChangesAsync();

            var salesPersonToReturn = _mapper.Map<SalesPersonReturnDto>(salesPersonEntity);
     
            return CreatedAtRoute(nameof(GetSalesPerson), new {salesPersonId = salesPersonEntity.Id},salesPersonToReturn);
        }

        [HttpGet]
        [Route("{salesPersonId}",Name ="GetSalesPerson")]
        public async Task<IActionResult> GetSalesPerson(Guid salesPersonId)
        {
            var salesPersonExists = await _salesPersonRepository.Exists(salesPersonId);
            if(!salesPersonExists)
            {
                return NotFound();
            }
            var salesPerson = await _salesPersonRepository.GetSingleAsQueryable()
                .Where(x => x.IsDeleted == false)
                .Where(x=>x.Id == salesPersonId)
                .FirstOrDefaultAsync();

            return Ok(_mapper.Map<SalesPersonReturnDto>(salesPerson));
        }

        [HttpGet]
        public async Task<IActionResult> GetSalesPersons([FromQuery] SalespersonQuery query)
        {
            var quaryable =  _salesPersonRepository.GetAllAsQueryable()
                .Where(x => x.IsDeleted == false);
                
            if(!string.IsNullOrEmpty(query.searchQuery))
            {
                quaryable = quaryable.Where(x =>
                x.Name.Contains(query.searchQuery) ||
                x.Email.Contains(query.searchQuery));
            }

            var salesPersons = await quaryable.ToListAsync();
            if (salesPersons == null)
                return NotFound();
            return Ok(_mapper.Map<List<SalesPersonReturnDto>>(salesPersons));
        }

        [HttpDelete("{salesPersonId}")]
        public async Task<IActionResult> DeleteSalesPerson(Guid salesPersonId)
        {
            var salesPersonExists = await _salesPersonRepository.Exists(salesPersonId);
            if(!salesPersonExists)
            {
                return NotFound();
            }

            var salesPersonEntity = await _salesPersonRepository.GetSingle(salesPersonId);
            //_salesPersonRepository.Delete(salesPersonEntity);
            salesPersonEntity.IsDeleted = true;
            await _salesPersonRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{salesPersonId}")]
        public async Task<IActionResult> SalesPersonUpate(Guid salesPersonId,SalesPersonUpdateDto salesPerson)
        {
            var salesPersonExists = await _salesPersonRepository.Exists(salesPersonId);
            if (!salesPersonExists)
            {
                return NotFound();
            }

            var salesPersonFromRepo = await _salesPersonRepository.GetSingle(salesPersonId);
            _mapper.Map(salesPerson, salesPersonFromRepo);
            _salesPersonRepository.Update(salesPersonFromRepo);
            await _salesPersonRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
