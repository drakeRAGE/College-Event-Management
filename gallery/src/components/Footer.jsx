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
      { name: "College", link: "https://www.gbpuat.ac.in/colleges/COT/index.html" },
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
    <footer className="relative w-full p-12 bg-gray-200">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <Typography variant="h5" className="mb-6 text-gray-900">
              G.B. Pant University of Agriculture & Technology
            </Typography>
            <Typography className="text-gray-600 text-lg mb-4">
              Pantnagar, Udham Singh Nagar<br />
              Uttarakhand, India - 263145
            </Typography>
          </div>
          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  className="mb-3 font-medium text-gray-900"
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
                      className="py-1.5 font-normal text-gray-600 transition-colors hover:text-blue-600"
                    >
                      {item.name}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 py-4 md:flex-row md:justify-between">
          <Typography
            variant="small"
            className="mb-4 text-center font-normal text-xl text-gray-700 md:mb-0 flex w-full items-center justify-center"
          >
            &copy; {currentYear} &nbsp; <a href="/"> GBPUAT Pantnagar</a>. All Rights Reserved.
          </Typography>
        </div>
      </div>
    </footer>
  );
}