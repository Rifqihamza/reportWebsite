import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion
      className="**:rounded-xl! 
             [&_.p-accordion-header]:mt-2 
             [&_.p-accordion-header-link]:border-none! 
             [&_.p-accordion-header-link]:bg-[var(--primary)]! 
             [&_.p-accordion-header-link]:text-white! 
             [&_.p-accordion-header-link]:font-medium! 
             [&_.p-accordion-header-link:hover]:bg-[color-mix(in_srgb,var(--primary)_90%,white_10%)]! 
             [&_.p-accordion-content]:bg-[var(--primary)]/60! 
             [&_.p-accordion-content]:border-2! 
             [&_.p-accordion-content]:border-[var(--secondary)]! 
             [&_.p-accordion-content]:text-white! 
             [&_.p-accordion-content]:mt-2! 
             w-full"
    >
      {Object.keys(list_of_faq).map((question, index) => (
        <AccordionTab
          key={index}
          header={question}
          className="text-sm md:text-md"
        >
          <p className="text-white">{list_of_faq[question]}</p>
        </AccordionTab>
      ))}
    </Accordion>

  </>;
}