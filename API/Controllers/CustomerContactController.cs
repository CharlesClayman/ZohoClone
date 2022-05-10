using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CustomerContactController:BaseApiController
    {
        private readonly IRepository<CustomerContactPerson,Guid> _customerContactRepository;
        private readonly IMapper _mapper;

        public CustomerContactController(IRepository<CustomerContactPerson,Guid> customerContactRepository, IMapper mapper)
        {
            _customerContactRepository = customerContactRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomerContact([FromBody] CustomerContactCreationDto customerContact)
        {
            if (customerContact == null)
                return BadRequest();
            var customerContactEntity = _mapper.Map<CustomerContactPerson>(customerContact);
            _customerContactRepository.Add(customerContactEntity);
            await _customerContactRepository.SaveChangesAsync();

            var customerContactToReturn = _mapper.Map<CustomerContactReturnDto>(customerContactEntity);

            return CreatedAtRoute(nameof(GetCustomerContact), new { customerContactId = customerContactEntity.Id }, customerContactToReturn);
        }

        [HttpGet]
        [Route("{customerContactId}", Name = "GetCustomerContact")]
        public async Task<IActionResult> GetCustomerContact(Guid customerContactId)
        {
            var customerContactExists = await _customerContactRepository.Exists(customerContactId);
            if (!customerContactExists)
            {
                return NotFound();
            }
            var customerContact = await _customerContactRepository.GetSingleAsQueryable()
                .Where(x=>x.IsDeleted == false)
                .FirstOrDefaultAsync();

            return Ok(_mapper.Map<CustomerContactReturnDto>(customerContact));
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerContacts()
        {
            var customerContacts = await _customerContactRepository.GetAllAsQueryable()
                .Where(x=>x.IsDeleted == false)
                .ToListAsync();

            if (customerContacts == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<CustomerContactReturnDto>>(customerContacts));
        }

        [HttpDelete("{customerContactId}")]
        public async Task<IActionResult> DeleteCustomerContact(Guid customerContactId)
        {
            var customerContactExists = await _customerContactRepository.Exists(customerContactId);
            if (!customerContactExists)
            {
                NotFound();
            }
            var customerContactEntity = await _customerContactRepository.GetSingle(customerContactId);
            //_customerContactRepository.Delete(customerContactEntity);
            customerContactEntity.IsDeleted = true;
            await _customerContactRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{customerContactId}")]
        public async Task<IActionResult> UpdateCustomerContact(Guid customerContactId, CustomerContactUpdateDto customerContact)
        {
            var customerContactExists = await _customerContactRepository.Exists(customerContactId);
            if (!customerContactExists)
            {
                NotFound();
            }
            var customerContactFromRepo = await _customerContactRepository.GetSingle(customerContactId);

            _mapper.Map(customerContact, customerContactFromRepo);
            _customerContactRepository.Update(customerContactFromRepo);
            await _customerContactRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
