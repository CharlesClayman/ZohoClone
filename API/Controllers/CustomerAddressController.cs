using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CustomerAddressController:BaseApiController    
    {
        private readonly IRepository<CustomerAddress, Guid> _customerAddressRepository;
        private readonly IMapper _mapper;

        public CustomerAddressController(IRepository<CustomerAddress, Guid> customerAddressRepository, IMapper mapper)
        {
            _customerAddressRepository = customerAddressRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomerAddress([FromBody] CustomerAddressCreationDto customerAddress)
        {
            if (customerAddress == null)
                return BadRequest();
            var customerAddressEntity = _mapper.Map<CustomerAddress>(customerAddress);
            _customerAddressRepository.Add(customerAddressEntity);
            await _customerAddressRepository.SaveChangesAsync();

            var customerAddressToReturn = _mapper.Map<CustomerAddressReturnDto>(customerAddressEntity);

            return CreatedAtRoute(nameof(GetCustomerAddress), new { customerAddressId = customerAddressEntity.Id }, customerAddressToReturn);
        }

        [HttpGet]
        [Route("{customerAddressId}", Name = "GetCustomerAddress")]
        public async Task<IActionResult> GetCustomerAddress(Guid customerAddressId)
        {
            var customerAddressExists = await _customerAddressRepository.Exists(customerAddressId);
            if (!customerAddressExists)
            {
                return NotFound();
            }
            var customerAddress = await _customerAddressRepository.GetSingleAsQueryable()
                .Where(x=>x.IsDeleted == false)
                .Where(x=>x.Id == customerAddressId)
                .FirstOrDefaultAsync();

            return Ok(_mapper.Map<CustomerAddressReturnDto>(customerAddress));
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerAddresses()
        {
            var customerAddresses = await _customerAddressRepository.GetAllAsQueryable()
                .Where(x=>x.IsDeleted == false)
                .ToListAsync();

            if (customerAddresses == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<CustomerAddressReturnDto>>(customerAddresses));
        }

        [HttpDelete("{customerAddressId}")]
        public async Task<IActionResult> DeleteCustomerAddress(Guid customerAddressId)
        {
            var customerAddressExists = await _customerAddressRepository.Exists(customerAddressId);
            if (!customerAddressExists)
            {
                NotFound();
            }
            var customerAddressEntity = await _customerAddressRepository.GetSingle(customerAddressId);
            // _customerAddressRepository.Delete(customerAddressEntity);
            customerAddressEntity.IsDeleted = true;
            await _customerAddressRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{customerAddressId}")]
        public async Task<IActionResult> UpdateCustomerAddress(Guid customerAddressId, CustomerAddressUpdateDto customerAddress)
        {
            var customerAddressExists = await _customerAddressRepository.Exists(customerAddressId);
            if (!customerAddressExists)
            {
                NotFound();
            }
            var customerAddressFromRepo = await _customerAddressRepository.GetSingle(customerAddressId);

            _mapper.Map(customerAddress, customerAddressFromRepo);
            _customerAddressRepository.Update(customerAddressFromRepo);
            await _customerAddressRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
