using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class InvoiceController:BaseApiController
    {
        private readonly IRepository<Invoice,Guid> _invoiceRepository;
        private readonly IMapper _mapper;

        public InvoiceController(IRepository<Invoice,Guid> invoiceRepository,IMapper mapper)
        {
            _invoiceRepository = invoiceRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateInvoice([FromBody] InvoiceCreationDto invoice)
        {
            if (invoice == null)
                return BadRequest();
            var invoiceEntity = _mapper.Map<Invoice>(invoice);
            _invoiceRepository.Add(invoiceEntity);
            await _invoiceRepository.SaveChangesAsync();
            
            var invoiceToReturn = _mapper.Map<InvoiceReturnDto>(invoiceEntity);

            return CreatedAtRoute(nameof(GetInvoice),new {invoiceId=invoiceEntity.Id},invoiceToReturn);
        }
       

        [HttpGet]
        [Route("{invoiceId}",Name =nameof(GetInvoice))]
        public async Task<IActionResult> GetInvoice(Guid invoiceId)
        {
            var invoiceExists = await _invoiceRepository.Exists(invoiceId);
            if (!invoiceExists)
            {
                return NotFound();
            }
            var invoice = await _invoiceRepository.GetSingleAsQueryable()
                .Where(x => x.Id == invoiceId) 
                .Where(x=>x.IsDeleted == false)
                .Include(x=>x.Customer).ThenInclude(x=>x.OtherDetails)
                .Include(x=>x.Terms)
                .Include(x => x.SalesPerson)
                .Include(x=>x.Items).ThenInclude(x=>x.Item)
                .Include(x => x.Items).ThenInclude(x => x.Tax)
                .FirstOrDefaultAsync();

            return Ok(_mapper.Map<InvoiceReturnDto>(invoice));
        }

        [HttpGet]
        public async Task<IActionResult> GetInvoices([FromQuery] InvoiceQuery query)
        {
            var queryable = _invoiceRepository.GetSingleAsQueryable()
                .Include(x => x.Customer).ThenInclude(x => x.OtherDetails)
                .Include(x => x.Terms)
                .Include(x => x.SalesPerson)
                .Include(x => x.Items).ThenInclude(x => x.Item)
                .Include(x => x.Items).ThenInclude(x => x.Tax)
                .Where(x => x.IsDeleted == false);


            if (!string.IsNullOrEmpty(query.searchQuery))
            {
                queryable = queryable.Where(x =>
                x.InvoiceDate.ToString().Contains(query.searchQuery) ||
                x.InvoiceNumber.Contains(query.searchQuery) ||
                x.OrderNumber.Contains(query.searchQuery) ||
                x.Customer.FirstName.Contains(query.searchQuery) ||
                x.Customer.LastName.Contains(query.searchQuery) ||
                x.DueDate.ToString().Contains(query.searchQuery) ||
                x.Total.ToString().Contains(query.searchQuery) ||
                x.Currency.Contains(query.searchQuery)
                );
             
            }

            var invoices = await queryable.ToListAsync();

            if (invoices == null)
                return NotFound();
            return Ok(_mapper.Map<IEnumerable<InvoiceReturnDto>>(invoices));
        }

        [HttpDelete("{invoiceId}")]
        public async Task<IActionResult> DeleteInvoice(Guid invoiceId)
        {
            var invoiceExists = await _invoiceRepository.Exists(invoiceId);
            if(!invoiceExists)
            {
                NotFound();
            }
            var invoiceEntity = await _invoiceRepository.GetSingle(invoiceId);
            // _invoiceRepository.Delete(invoiceEntity);
            invoiceEntity.IsDeleted = true;
            await _invoiceRepository.SaveChangesAsync();

            return NoContent();
        }


        [HttpPut("{invoiceId}")]
        public async Task<IActionResult> UpdateInvoice(Guid invoiceId,InvoiceUpdateDto invoice)
        {
            var invoiceExists = await _invoiceRepository.Exists(invoiceId);
            if (!invoiceExists)
            {
                NotFound();
            }
            var invoiceFromRepo = await _invoiceRepository.GetAllAsQueryable()
                 .Where(_x => _x.IsDeleted == false)
                 .Where(x => x.Id == invoiceId)
                 .Include(x => x.Items)
                 .FirstOrDefaultAsync();



            _mapper.Map(invoice, invoiceFromRepo);
            _invoiceRepository.Update(invoiceFromRepo);
            await _invoiceRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
