using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

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
            var invoice = await _invoiceRepository.GetSingleAsync(invoiceId);
            return Ok(_mapper.Map<InvoiceReturnDto>(invoice));
        }

        [HttpGet]
        public async Task<IActionResult> GetInvoices()
        {
            var invoices = await _invoiceRepository.GetAllAsync();
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
            var invoiceEntity = await _invoiceRepository.GetSingleAsync(invoiceId);
            _invoiceRepository.Delete(invoiceEntity);
            await _invoiceRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{invoiceId}")]
        public async Task<IActionResult> UpdateIncome(Guid invoiceId,InvoiceUpdateDto invoice)
        {
            var invoiceExists = await _invoiceRepository.Exists(invoiceId);
            if (!invoiceExists)
            {
                NotFound();
            }
            var invoiceFromRepo = await _invoiceRepository.GetSingleAsync(invoiceId);
            _mapper.Map(invoice, invoiceFromRepo);
            _invoiceRepository.Update(invoiceFromRepo);
            await _invoiceRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
