using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ItemsController : BaseApiController
    {
        private readonly IRepository<Item,Guid> _itemsRepository;
        private readonly IMapper _mapper;

        public ItemsController(IRepository<Item,Guid> itemsRepository,IMapper mapper)
        {
            _itemsRepository = itemsRepository;
            _mapper = mapper;
        }

        [HttpPost]
 
        public async Task<IActionResult> CreateItem([FromBody] ItemCreationDto item)
        {
            if (item == null)
                return BadRequest();

            var itemEntity = _mapper.Map<Item>(item);
            _itemsRepository.Add(itemEntity);
            await _itemsRepository.SaveChangesAsync();

            var itemToReturn = _mapper.Map<ItemReturnDto>(itemEntity);

            return CreatedAtRoute(nameof(GetItem), new { itemId = itemEntity.Id }, itemToReturn);
        }


        [HttpGet]
        [Route("{itemId}", Name = "GetItem")]
        public async Task<ActionResult<Item>> GetItem(Guid itemId)
        {
            var itemExists = await _itemsRepository.Exists(itemId);
            if(!itemExists)
            {
                return NotFound();
            }
            var item = await _itemsRepository.GetSingleAsQueryable().Where(x => x.Id == itemId).Where(w => w.IsDeleted == false).FirstOrDefaultAsync();
            return Ok(_mapper.Map<ItemReturnDto>(item));
        }

        [HttpGet]
        public async Task<IActionResult> GetItems([FromQuery] ItemQuery query)
        {
            var queryable = _itemsRepository.GetAllAsQueryable().Where(w=>w.IsDeleted==false);

            if(!string.IsNullOrWhiteSpace(query.searchQuery))
            {
                queryable = queryable.Where(x=>
                x.Name.Contains(query.searchQuery)||
                x.Description.Contains(query.searchQuery)||
                x.SellingPrice.ToString().Contains(query.searchQuery)||
                x.Currency.Contains(query.searchQuery) ||
                x.Unit.Contains(query.searchQuery));
            }

            var items = await queryable.ToListAsync();

            if (items == null)
                return NotFound();

            return Ok(_mapper.Map<List<ItemReturnDto>>(items));
        }

        [HttpDelete("{itemId}")]
        public async Task<IActionResult> DeleteItem(Guid itemId)
        {
            var itemExists = await _itemsRepository.Exists(itemId);
            if(!itemExists)
            {
                NotFound();
            }
            var item = await _itemsRepository.GetSingle(itemId);
            //_itemsRepository.Delete(item);
            item.IsDeleted = true;
            await _itemsRepository.SaveChangesAsync();
            
            return NoContent();
        }
        

        [HttpPut("{itemId}")]
        public async Task<IActionResult> UpdateItem(Guid itemId,ItemUpdateDto item)
        {
            var itemExists = await _itemsRepository.Exists(itemId);
            if (!itemExists)
            {
                NotFound();
            }

            var itemFromRepo = await _itemsRepository.GetSingle(itemId);
            _mapper.Map(item, itemFromRepo);
            _itemsRepository.Update(itemFromRepo);
            await _itemsRepository.SaveChangesAsync();

            return NoContent();
        }

    }
}
