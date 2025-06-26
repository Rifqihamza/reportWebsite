import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion className="bg-white! **:bg-white! w-full">
        {Object.keys(list_of_faq).map((question, index) => {
          return <AccordionTab key={index} header={question} className="text-sm md:text-md">
            <p>{list_of_faq[question]}</p>
          </AccordionTab>;
        })}
    </Accordion>
  </>;
}