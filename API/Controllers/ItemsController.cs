using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

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
      //  [ItemResultFilter]
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
            var item = await _itemsRepository.GetSingleAsync(itemId);

            return Ok(_mapper.Map<ItemReturnDto>(item));
        }

        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            var items = await _itemsRepository.GetAllAsync();
            if (items == null)
                return NotFound();

            return Ok(_mapper.Map<List<ItemReturnDto>>(items));
        }

        [HttpDelete("itemId")]
        public async Task<IActionResult> DeleteItem(Guid itemId)
        {
            var itemExists = await _itemsRepository.Exists(itemId);
            if(!itemExists)
            {
                NotFound();
            }
            var item = await _itemsRepository.GetSingleAsync(itemId);
            _itemsRepository.Delete(item);
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

            var itemFromRepo = await _itemsRepository.GetSingleAsync(itemId);
            _mapper.Map(item, itemFromRepo);
            _itemsRepository.Update(itemFromRepo);
            await _itemsRepository.SaveChangesAsync();

            return NoContent();
        }

    }
}
