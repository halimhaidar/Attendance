using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Attendance.Controllers
{
    public class AttendanceController : Controller
    {        
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Employee()
        {
            return View();
        }
        public IActionResult Department()
        {
            return View();
        }
        public IActionResult Role()
        {
            return View();
        }

        public IActionResult QRgen()
        {
            return View();
        }
        public IActionResult Profile()
        {
            return View();
        }

        public IActionResult Approval()
        {
            return View();
        }

        public IActionResult Check()
        {
            return View();
        }
    }
}
