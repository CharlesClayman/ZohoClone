using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Data.Common;

namespace API.Helpers
{
    public class AutoMapperProfiles:Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUserCreationDto, AppUser>()
                .ForMember(dest =>dest.UserName, opt=>opt.MapFrom(src=>src.FirstName));

            CreateMap<ItemCreationDto,Item>();
            CreateMap<IncomeCreationDto,Income>();
            CreateMap<ExpenseCreationDto,Expenses>();
            CreateMap<CategoryCreationDto,Category>();
            CreateMap<CustomerCreationDto,Customer>();
            CreateMap<SalesPersonCreationDto,SalesPerson>();
            CreateMap<InvoiceCreationDto,Invoice>();
            CreateMap<TermCreationDto,Terms>();
            CreateMap<TermUpdateDto, Terms>();
            CreateMap<SalesPersonUpdateDto,SalesPerson>();
            CreateMap<ItemUpdateDto,Item>();
            CreateMap<InvoiceUpdateDto,Invoice>();
            CreateMap<IncomeUpdateDto,Income>();
            CreateMap<ExpenseUpdateDto,Expenses>();
            CreateMap<CustomerUpdateDto,Customer>();
            CreateMap<CategoryUpdateDto,Category>();
            CreateMap<TaxUpdateDto, Tax>();
            CreateMap<Customer, CustomerReturnDto>();
            CreateMap<Terms, TermReturnDto>();
            CreateMap<IEnumerable<Terms>, TermReturnDto>();
            CreateMap<SalesPerson,SalesPersonReturnDto>();
            CreateMap<IEnumerable<SalesPerson>, SalesPersonReturnDto>();
            CreateMap<Item, ItemReturnDto>();
            CreateMap<IEnumerable<Item>, ItemReturnDto>();
            CreateMap<Invoice, InvoiceReturnDto>();
            CreateMap<IEnumerable<Invoice>, InvoiceReturnDto>();
            CreateMap<Income, IncomeReturnDto>();
            CreateMap<Expenses,ExpenseReturnDto>();
            CreateMap<Category, CategoryReturnDto>();
            CreateMap<IEnumerable<Category>,CategoryReturnDto>();
            CreateMap<CustomerAddress, CustomerAddressReturnDto>();
            CreateMap<CustomerAddressCreationDto, CustomerAddress>();               
               
                
            CreateMap<IEnumerable<CustomerAddress>, CustomerAddressReturnDto>();
            CreateMap<TaxCreationDto, Tax>();
            CreateMap<Tax, TaxReturnDto>();
            CreateMap<IEnumerable<Tax>, TaxReturnDto>();

            CreateMap<CustomerOtherDetailsCreationDto, CustomerOtherDetails>();
                
            CreateMap<CustomerOtherDetails, CustomerOtherDetailsReturnDto>();
            CreateMap<CustomerContactCreationDto, CustomerContactPerson>();

            CreateMap<CustomerContactPerson, CustomerContactReturnDto>();

            CreateMap<InvoiceItemCreationDto, InvoiceItem>();
            CreateMap<InvoiceItem, InvoiceItemReturnDto>();
            CreateMap<AppUser, CurrentUserReturnDto>().ForMember(dest => dest.FullName, src => src.MapFrom(n => n.FirstName +" "+ n.LastName));
         
        }

    }
}
