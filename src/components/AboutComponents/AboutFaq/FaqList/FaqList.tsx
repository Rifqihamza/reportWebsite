import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion className=" **:rounded-xl! [&_.p-accordion-header]:mt-2 [&_.p-accordion-header]:bg-transparent! [&_.p-accordion-header-link]:border-none! [&_.p-accordion-header-link]:bg-[#257180]! [&_.p-accordion-header-link]:text-white! [&_.p-accordion-content]:bg-[#F2E5BF]! [&_.p-accordion-content]:text-black! [&_.p-accordion-content]:border-none! [&_.p-accordion-content]:mt-2! w-full">
      {Object.keys(list_of_faq).map((question, index) => {
        return <AccordionTab key={index} header={question} className="text-sm md:text-md">
          <p>{list_of_faq[question]}</p>
        </AccordionTab>;
      })}
    </Accordion>
  </>;
}