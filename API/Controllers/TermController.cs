using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TermController : BaseApiController
    {
        private readonly IRepository<Terms,Guid> _termRepository;
        private readonly IMapper _mapper;

        public TermController(IRepository<Terms,Guid> termRepository, IMapper mapper)
        {
            _termRepository = termRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTerm([FromBody] TermCreationDto term)
        {
            var termEntity = _mapper.Map<Terms>(term);
            _termRepository.Add(termEntity);
            await _termRepository.SaveChangesAsync();

            var termToReturn = _mapper.Map<TermReturnDto>(termEntity);

            return CreatedAtRoute(nameof(GetTerm), new { termId = termEntity.Id }, termToReturn);
        }

        [HttpGet]
        [Route("{termId}", Name = "GetTerm")]
        public async Task<IActionResult> GetTerm(Guid termId)
        {
            var termExists = await _termRepository.Exists(termId);
            if(!termExists)
            {
                return NotFound();
            }
            var terms = await _termRepository.GetSingleAsync(termId);
         
            return Ok(_mapper.Map<TermReturnDto>(terms));
        }

        [HttpGet]
        public async Task<IActionResult> GetTerms()
        {
            var terms = await _termRepository.GetAllAsync();
            if (terms == null)
                return NotFound();
            return Ok(_mapper.Map<List<TermReturnDto>>(terms));
        }


        [HttpDelete("{termId}")]
        public async Task<IActionResult> DeleteTerm(Guid termId)
        {
            var termEntityExists = await _termRepository.Exists(termId);
            if (!termEntityExists)
            {
                return NotFound();
            }

            var termEntity = await _termRepository.GetSingleAsync(termId);
            _termRepository.Delete(termEntity);
            await _termRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{termId}")]
        public async Task<IActionResult> UpdateTerm(Guid termId,TermUpdateDto term)
        {
            var termEntityExists = await _termRepository.Exists(termId);
            if (!termEntityExists)
            {
                return NotFound();
            }

            var termFromRepo = await _termRepository.GetSingleAsync(termId);

            _mapper.Map(term, termFromRepo);

            _termRepository.Update(termFromRepo);
            await _termRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
