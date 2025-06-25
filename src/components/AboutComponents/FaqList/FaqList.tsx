import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion className="bg-[#e3e3e3]! **:bg-[#e3e3e3]!">
        {Object.keys(list_of_faq).map((question) => {
          return <AccordionTab header={question} className="text-sm md:text-md">
            <p>{list_of_faq[question]}</p>
          </AccordionTab>;
        })}
    </Accordion>
  </>;
}