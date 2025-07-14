import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion className=" **:text-white! **:rounded-2xl! [&_.p-accordion-header]:mt-2 [&_.p-accordion-header]:bg-transparent! [&_.p-accordion-header-link]:bg-[#257180]! [&_.p-accordion-content]:bg-[#CB6040]! [&_.p-accordion-content]:mt-2! w-full">
      {Object.keys(list_of_faq).map((question, index) => {
        return <AccordionTab key={index} header={question} className="text-sm md:text-md">
          <p>{list_of_faq[question]}</p>
        </AccordionTab>;
      })}
    </Accordion>
  </>;
}