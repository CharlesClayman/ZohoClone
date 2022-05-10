using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            var terms = await _termRepository.GetSingleAsQueryable()
                .Where(x => x.IsDeleted == false)
                .Where(x => x.Id == termId)
                .FirstOrDefaultAsync(); 
         
            return Ok(_mapper.Map<TermReturnDto>(terms));
        }

        [HttpGet]
        public async Task<IActionResult> GetTerms([FromQuery] TermQuery query)
        {
            var quaryable = _termRepository.GetAllAsQueryable()
                .Where(x => x.IsDeleted == false);

            if (!string.IsNullOrEmpty(query.searchQuery))
            {
                quaryable = quaryable.Where(x =>
                x.TermName.Contains(query.searchQuery) ||
                x.TermDays.ToString().Contains(query.searchQuery));
            }

            var terms = await quaryable.ToListAsync();
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

            var termEntity = await _termRepository.GetSingle(termId);
                
            //_termRepository.Delete(termEntity);
            termEntity.IsDeleted = true;
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
            var termFromRepo = await _termRepository.GetSingle(termId);


            _mapper.Map(term, termFromRepo);
            _termRepository.Update(termFromRepo);
            await _termRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
