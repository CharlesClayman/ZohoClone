using API.Data;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Threading;

namespace API.Services
{
    public class Repository<MT,T> : IRepository<MT,T> where MT : class
    { 
        private readonly DataContext _context;
       
        public Repository(DataContext context)
        {
            _context = context;
        }
        public void Add(MT item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
           
            _context.Set<MT>().Add(item);
        }

        public void AddRange(IEnumerable<MT> items)
        {
            if (items == null)
                throw new ArgumentNullException(nameof(items));

            _context.Set<MT>().AddRange(items);
        }

        public void Delete(MT item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));

            _context.Set<MT>().Remove(item);
        } 

        public async Task<bool> Exists(T id)
        {
           var entity = await _context.Set<MT>().FindAsync(id) ;
            if(entity == null)
                return false;
            return true;
        }

      

        public IQueryable<MT> GetAllAsQueryable()
        {
            return _context.Set<MT>().AsQueryable();
        }
        public IQueryable<MT> GetSingleAsQueryable()
        {
            return _context.Set<MT>().AsQueryable();
        }

        public async Task<MT> GetSingle(T Id)
        {
            return await _context.Set<MT>().FindAsync(Id);
        }
       

        public async Task SaveChangesAsync()
        {
           
                await _context.SaveChangesAsync();
           
        }

        

        public void Update(MT item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));
            _context.Entry(item).State = EntityState.Modified;
        }

        private bool disposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}
