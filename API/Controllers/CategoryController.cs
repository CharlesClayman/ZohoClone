using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class CategoryController:BaseApiController
    {
        private readonly IRepository<Category,Guid> _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(IRepository<Category,Guid> categoryRepository,IMapper mapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] CategoryCreationDto category)
        {
           if(category == null)
                return BadRequest();
           var categoryEntity = _mapper.Map<Category>(category);
           _categoryRepository.Add(categoryEntity);
           await _categoryRepository.SaveChangesAsync();

            var categoryToReturn = _mapper.Map<CategoryReturnDto>(categoryEntity);

            return CreatedAtRoute(nameof(GetCategory), new { categoryId = categoryEntity.Id},categoryToReturn);
        }

        [HttpGet]
        [Route("{categoryId}", Name ="GetCategory")]
        public async Task<IActionResult> GetCategory(Guid categoryId)
        {
            var categoryExists = await _categoryRepository.Exists(categoryId);
            if(!categoryExists)
            {
                return NotFound();
            }
            var category = await _categoryRepository.GetSingleAsync(categoryId);

            return Ok(_mapper.Map<CategoryReturnDto>(category));
        }

        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepository.GetAllAsync();
            if (categories == null)
                return NotFound();

            return Ok(_mapper.Map<IEnumerable<CategoryReturnDto>>(categories));
        }

        [HttpDelete("categoryId")]
        public async Task<IActionResult> DeleteCategory(Guid categoryId)
        {
            var customerExists = await _categoryRepository.Exists(categoryId);
            if(!customerExists)
            {
                NotFound();
            }
            var customerEntity = await _categoryRepository.GetSingleAsync(categoryId);
            _categoryRepository.Delete(customerEntity);
            await _categoryRepository.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("categoryId")]
        public async Task<IActionResult> UpdateCategory(Guid categoryId, CategoryUpdateDto category)
        {
            var customerExists = await _categoryRepository.Exists(categoryId);
            if (!customerExists)
            {
                NotFound();
            }
            var customerFromRepo = await _categoryRepository.GetSingleAsync(categoryId);

            _mapper.Map(category, customerFromRepo);
            _categoryRepository.Update(customerFromRepo);
            await _categoryRepository.SaveChangesAsync();

            return NoContent();
        }
    }
}
