import { Accordion, AccordionTab } from 'primereact/accordion';
import { list_of_faq } from "../../../types/faq";

export default function FaqList() {

  return <>
    <Accordion>
        {Object.keys(list_of_faq).map((question) => {
          return <AccordionTab header={question}>
            <p>{list_of_faq[question]}</p>
          </AccordionTab>;
        })}
    </Accordion>
  </>;
}