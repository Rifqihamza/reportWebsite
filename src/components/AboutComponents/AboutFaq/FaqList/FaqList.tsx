import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion className=" **:text-white! **:rounded-xl! [&_.p-accordion-header]:mt-2 [&_.p-accordion-header]:bg-transparent! [&_.p-accordion-header-link]:border-none! [&_.p-accordion-header-link]:bg-[#A8492F]! [&_.p-accordion-content]:bg-[#1E5B66]! [&_.p-accordion-content]:border-none! [&_.p-accordion-content]:mt-2! w-full">
      {Object.keys(list_of_faq).map((question, index) => {
        return <AccordionTab key={index} header={question} className="text-sm md:text-md">
          <p>{list_of_faq[question]}</p>
        </AccordionTab>;
      })}
    </Accordion>
  </>;
}