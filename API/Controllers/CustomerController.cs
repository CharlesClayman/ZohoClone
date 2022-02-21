using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; 

namespace API.Controllers
{

    public class CustomerController:BaseApiController
    {
        private readonly IRepository<Customer,Guid> _customerRepository;
        private readonly IMapper _mapper;

        public CustomerController(IRepository<Customer,Guid> customerRepository,IMapper mapper)
        {
            _customerRepository = customerRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerCreationDto customer)
        {
            if (customer == null)
                return BadRequest();
            //Eliminating all null or empty addresses
            if ((customer.Address[0].AddressType == AddressType.BillingAddress) && (customer.Address[0].Attention == "" || customer.Address[0].Attention == null) &&
                (customer.Address[0].CountryOrRegion == "" || customer.Address[0].CountryOrRegion == null) && (customer.Address[0].StreetOneAddress == "" || customer.Address[0].StreetOneAddress == null) &&
                (customer.Address[0].StreetTwoAddress == "" || customer.Address[0].StreetTwoAddress == null) && (customer.Address[0].City == "" || customer.Address[0].City == null) &&
                (customer.Address[0].State == "" || customer.Address[0].State == null) && (customer.Address[0].City == "" || customer.Address[0].City == null)
               && (customer.Address[0].State == "" || customer.Address[0].State == null) && (customer.Address[0].ZipCode == "" || customer.Address[0].ZipCode == null) &&
               (customer.Address[0].Phone == "" || customer.Address[0].Phone == null) && (customer.Address[0].Fax == "" || customer.Address[0].Fax == null))
            {

                if ((customer.Address[1].AddressType == AddressType.ShippingAddress) && (customer.Address[1].Attention == "" || customer.Address[1].Attention == null) &&
                    (customer.Address[1].CountryOrRegion == "" || customer.Address[1].CountryOrRegion == null) && (customer.Address[1].StreetOneAddress == "" || customer.Address[1].StreetOneAddress == null) &&
                    (customer.Address[1].StreetTwoAddress == "" || customer.Address[1].StreetTwoAddress == null) && (customer.Address[1].City == "" || customer.Address[1].City == null) &&
                    (customer.Address[1].State == "" || customer.Address[1].State == null) && (customer.Address[1].City == "" || customer.Address[1].City == null)
                   && (customer.Address[1].State == "" || customer.Address[1].State == null) && (customer.Address[1].ZipCode == "" || customer.Address[1].ZipCode == null) &&
                   (customer.Address[1].Phone == "" || customer.Address[1].Phone == null) && (customer.Address[1].Fax == "" || customer.Address[1].Fax == null))
                {
                    customer.Address = null;
                }
            }

            //Eliminating null or empty  contact persons
          
            if(customer.ContactPersons.Count>1)
            {
                if ((customer.ContactPersons[1].FirstName == null || customer.ContactPersons[1].FirstName == "") && (customer.ContactPersons[1].LastName == null || customer.ContactPersons[1].LastName == "") &&
               (customer.ContactPersons[1].Email == null || customer.ContactPersons[1].Email == "") && (customer.ContactPersons[1].WorkPhone == null || customer.ContactPersons[1].WorkPhone == "") &&
               (customer.ContactPersons[1].Mobile == null || customer.ContactPersons[1].WorkPhone == ""))
                {
                    customer.ContactPersons.RemoveAt(1);
                }
            }

            if ((customer.ContactPersons[0].FirstName == null || customer.ContactPersons[0].FirstName == "") && (customer.ContactPersons[0].LastName == null || customer.ContactPersons[0].LastName == "") &&
              (customer.ContactPersons[0].Email == null || customer.ContactPersons[0].Email == "") && (customer.ContactPersons[0].WorkPhone == null || customer.ContactPersons[0].WorkPhone == "") &&
              (customer.ContactPersons[0].Mobile == null || customer.ContactPersons[0].WorkPhone == ""))
            {
                customer.ContactPersons = null;
            }



            var customerEntity = _mapper.Map<Customer>(customer);
            _customerRepository.Add(customerEntity);
            
            await _customerRepository.SaveChangesAsync();

            var customerToReturn = _mapper.Map<CustomerReturnDto>(customerEntity);

            return CreatedAtRoute(nameof(GetCustomer),new {customerId = customerEntity.Id},customerToReturn);
        }

        [HttpGet]
        [Route("{customerId}",Name ="GetCustomer")]
        public async Task<IActionResult> GetCustomer(Guid customerId)
        {
            var customerExists = await _customerRepository.Exists(customerId);
            if(!customerExists)
            {
                return NotFound();
            }
            var customer = await _customerRepository.GetSingleAsQueryableAsync(i=>i.Id==customerId,x=>x.OtherDetails,x=>x.Address,x=>x.ContactPersons);
            ;
            return Ok(_mapper.Map<CustomerReturnDto>(customer));
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _customerRepository
                .GetAllAsQueryable()
                .Include(x => x.OtherDetails)
                .Include(x => x.Address)
                .Include(x => x.ContactPersons).ToListAsync();

            if (customers == null)
                return NotFound();
            return Ok(_mapper.Map<IEnumerable<CustomerReturnDto>>(customers));
        }

        [HttpDelete("{customerId}")]
        public async Task<IActionResult> DeleteCustomer(Guid customerId)
        {
            var customerExists = await _customerRepository.Exists(customerId);
            if(!customerExists)
            {
                NotFound();
            }
            var customerEntity = await _customerRepository.GetSingleAsync(customerId);
            _customerRepository.Delete(customerEntity);
            await _customerRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{customerId}")]
        public async Task<IActionResult> UpdateCustomer(Guid customerId, CustomerUpdateDto customer)
        {
            var customerExists = await _customerRepository.Exists(customerId);
            if (!customerExists)
            {
                NotFound();
            }

            //Eliminating all null or empty addresses
            if ((customer.Address[0].AddressType == AddressType.BillingAddress) && (customer.Address[0].Attention == "" || customer.Address[0].Attention == null) &&
                (customer.Address[0].CountryOrRegion == "" || customer.Address[0].CountryOrRegion == null) && (customer.Address[0].StreetOneAddress == "" || customer.Address[0].StreetOneAddress == null) &&
                (customer.Address[0].StreetTwoAddress == "" || customer.Address[0].StreetTwoAddress == null) && (customer.Address[0].City == "" || customer.Address[0].City == null) &&
                (customer.Address[0].State == "" || customer.Address[0].State == null) && (customer.Address[0].City == "" || customer.Address[0].City == null)
               && (customer.Address[0].State == "" || customer.Address[0].State == null) && (customer.Address[0].ZipCode == "" || customer.Address[0].ZipCode == null) &&
               (customer.Address[0].Phone == "" || customer.Address[0].Phone == null) && (customer.Address[0].Fax == "" || customer.Address[0].Fax == null))
            {

                if ((customer.Address[1].AddressType == AddressType.ShippingAddress) && (customer.Address[1].Attention == "" || customer.Address[1].Attention == null) &&
                    (customer.Address[1].CountryOrRegion == "" || customer.Address[1].CountryOrRegion == null) && (customer.Address[1].StreetOneAddress == "" || customer.Address[1].StreetOneAddress == null) &&
                    (customer.Address[1].StreetTwoAddress == "" || customer.Address[1].StreetTwoAddress == null) && (customer.Address[1].City == "" || customer.Address[1].City == null) &&
                    (customer.Address[1].State == "" || customer.Address[1].State == null) && (customer.Address[1].City == "" || customer.Address[1].City == null)
                   && (customer.Address[1].State == "" || customer.Address[1].State == null) && (customer.Address[1].ZipCode == "" || customer.Address[1].ZipCode == null) &&
                   (customer.Address[1].Phone == "" || customer.Address[1].Phone == null) && (customer.Address[1].Fax == "" || customer.Address[1].Fax == null))
                {
                    customer.Address = null;
                }
            }

            //Eliminating null or empty  contact persons

            if (customer.ContactPersons.Count > 1)
            {
                if ((customer.ContactPersons[1].FirstName == null || customer.ContactPersons[1].FirstName == "") && (customer.ContactPersons[1].LastName == null || customer.ContactPersons[1].LastName == "") &&
               (customer.ContactPersons[1].Email == null || customer.ContactPersons[1].Email == "") && (customer.ContactPersons[1].WorkPhone == null || customer.ContactPersons[1].WorkPhone == "") &&
               (customer.ContactPersons[1].Mobile == null || customer.ContactPersons[1].WorkPhone == ""))
                {
                    customer.ContactPersons.RemoveAt(1);
                }
            }

            if ((customer.ContactPersons[0].FirstName == null || customer.ContactPersons[0].FirstName == "") && (customer.ContactPersons[0].LastName == null || customer.ContactPersons[0].LastName == "") &&
              (customer.ContactPersons[0].Email == null || customer.ContactPersons[0].Email == "") && (customer.ContactPersons[0].WorkPhone == null || customer.ContactPersons[0].WorkPhone == "") &&
              (customer.ContactPersons[0].Mobile == null || customer.ContactPersons[0].WorkPhone == ""))
            {
                customer.ContactPersons = null;
            }

            var customerFromRepo = await _customerRepository.GetSingleAsQueryableAsync(x=>x.Id==customerId,i=>i.OtherDetails,i=>i.Address,i=>i.ContactPersons);

            _mapper.Map(customer, customerFromRepo);
            _customerRepository.Update(customerFromRepo);
            await _customerRepository.SaveChangesAsync();

           return NoContent();
        }

    }
}
