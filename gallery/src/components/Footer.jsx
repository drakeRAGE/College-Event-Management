import { Typography } from "@material-tailwind/react";

const LINKS = [
  {
    title: "Page",
    items: [
      { name: "Events", link: "/events" },
      { name: "About", link: "/about" },
      { name: "Profile", link: "/profile" },
    ],
  },
  {
    title: "Campus",
    items: [
      { name: "University", link: "https://www.gbpuat.ac.in/" },
      { name: "College of Technology", link: "https://www.gbpuat.ac.in/colleges/COT/index.html" },
    ],
  },
  {
    title: "Quick Links",
    items: [
      { name: "Admissions", link: "https://www.gbpuat.ac.in/academics/admissions/index.html" },
      { name: "Job Opportunities", link: "https://www.gbpuat.ac.in/employments/index.html" },
    ],
  },
];

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative w-full p-6 md:p-12 bg-gray-200">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 justify-between gap-8 md:grid-cols-2">
          <div className="flex flex-col">
            <Typography variant="h5" className="mb-4 md:mb-6 text-gray-900 text-xl md:text-2xl">
              G.B. Pant University of Agriculture & Technology
            </Typography>
            <Typography className="text-gray-600 text-base md:text-lg mb-4">
              Pantnagar, Udham Singh Nagar<br />
              Uttarakhand, India - 263145
            </Typography>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  className="mb-3 font-medium text-gray-900 text-sm md:text-base"
                >
                  {title}
                </Typography>
                {items.map((item) => (
                  <li key={item.name}>
                    <Typography
                      as="a"
                      href={item.link}
                      target={item.link.startsWith('http') ? "_blank" : "_self"}
                      rel={item.link.startsWith('http') ? "noopener noreferrer" : ""}
                      className="py-1.5 font-normal text-gray-600 text-sm md:text-base transition-colors hover:text-blue-600 block"
                    >
                      {item.name}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 py-4 mt-8">
          <Typography
            variant="small"
            className="text-center font-normal text-base md:text-xl text-gray-700 flex w-full items-center justify-center"
          >
            &copy; {currentYear} &nbsp; <a href="/" className="hover:text-blue-600"> GBPUAT Pantnagar</a>. All Rights Reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}