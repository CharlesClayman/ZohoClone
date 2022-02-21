using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CustomerOtherDetailsController:BaseApiController
    {
        private readonly IRepository<CustomerOtherDetails,Guid> _customerOtherDetailRepository;
        private readonly IMapper _mapper;

        public CustomerOtherDetailsController(IRepository<CustomerOtherDetails,Guid> customerOtherDetailsRepository, IMapper mapper)
        {
            _customerOtherDetailRepository = customerOtherDetailsRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomerOtherDetail([FromBody] CustomerOtherDetailsCreationDto customerOtherDetail)
        {
            if (customerOtherDetail == null)
                return BadRequest();
            var customerOtherDetailEntity = _mapper.Map<CustomerOtherDetails>(customerOtherDetail);
            _customerOtherDetailRepository.Add(customerOtherDetailEntity);
            await _customerOtherDetailRepository.SaveChangesAsync();

            var customerOtherDetailToReturn = _mapper.Map<CustomerOtherDetailsReturnDto>(customerOtherDetailEntity);

            return CreatedAtRoute(nameof(GetCustomerOtherDetail), new { customerOtherDetailId = customerOtherDetailEntity.Id }, customerOtherDetailToReturn);
        }

        [HttpGet]
        [Route("{customerOtherDetailId}", Name = "GetCustomerOtherDetail")]
        public async Task<IActionResult> GetCustomerOtherDetail(Guid customerOtherDetailId)
        {
            var customerOtherDetailExists = await _customerOtherDetailRepository.Exists(customerOtherDetailId);
            if (!customerOtherDetailExists)
            {
                return NotFound();
            }
            var customerOtherDetail = await _customerOtherDetailRepository.GetSingleAsync(customerOtherDetailId);

            return Ok(_mapper.Map<CustomerOtherDetailsReturnDto>(customerOtherDetail));
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomerOtherDetails()
        {
            var customerOtherDetails = await _customerOtherDetailRepository.GetAllAsync();
            if (customerOtherDetails == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<CustomerOtherDetailsReturnDto>>(customerOtherDetails));
        }

        [HttpDelete("{customerOtherDetailId}")]
        public async Task<IActionResult> DeleteCustomerOtherDetails(Guid customerOtherDetailId)
        {
            var customerOtherDetailExists = await _customerOtherDetailRepository.Exists(customerOtherDetailId);
            if (!customerOtherDetailExists)
            {
                NotFound();
            }
            var customerOtherDetailEntity = await _customerOtherDetailRepository.GetSingleAsync(customerOtherDetailId);
            _customerOtherDetailRepository.Delete(customerOtherDetailEntity);
            await _customerOtherDetailRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{customerOtherDetailId}")]
        public async Task<IActionResult> UpdateCustomerOtherDetail(Guid customerOtherDetailId, CustomerOtherDetailsUpdateDto customerOtherDetail)
        {
            var customerContactExists = await _customerOtherDetailRepository.Exists(customerOtherDetailId);
            if (!customerContactExists)
            {
                NotFound();
            }
            var customerOtherDetailFromRepo = await _customerOtherDetailRepository.GetSingleAsync(customerOtherDetailId);

            _mapper.Map(customerOtherDetail, customerOtherDetailFromRepo);
            _customerOtherDetailRepository.Update(customerOtherDetailFromRepo);
            await _customerOtherDetailRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
