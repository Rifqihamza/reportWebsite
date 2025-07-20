import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion className=" **:text-white! **:rounded-xl! [&_.p-accordion-header]:mt-5 [&_.p-accordion-header]:bg-transparent! [&_.p-accordion-header-link]:border-none! [&_.p-accordion-header-link]:bg-white/10! [&_.p-accordion-header-link]:[box-shadow:0_0_3px_2px_#F2E5BF]! [&_.p-accordion-content]:bg-white/10! [&_.p-accordion-content]:border-none! [&_.p-accordion-content]:mt-4 w-full">
      {Object.keys(list_of_faq).map((question, index) => {
        return <AccordionTab key={index} header={question} className="text-sm md:text-md">
          <p>{list_of_faq[question]}</p>
        </AccordionTab>;
      })}
    </Accordion>
  </>;
}