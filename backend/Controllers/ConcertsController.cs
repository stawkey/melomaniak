using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;


namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ConcertsController : ControllerBase
{
    private readonly FilharmoniaContext _context;

    public ConcertsController(FilharmoniaContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Concert>>> Get()
    {
        return await _context.Concerts.Include(c => c.Composers).Include(c => c.Programmes).ToListAsync();
    }


}
