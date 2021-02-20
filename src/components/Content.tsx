/**
 * Content component
 * This component will wrap all of the pages within the dashboard
 *
 */
interface ContentProps {
  navbar?: any;
  head: any;
  body: any;
}

/**
 * navbar prop is optional
 * head and body are necessary
 * @param props
 */
export default function Content(props: ContentProps) {
  return (
    <div className="content">
      <div className="navbarSection">
        {props.navbar ? props.navbar : <div></div>}
      </div>
      <div className="rightSection">
        <div className="headSection">{props.head}</div>
        <div className="bodySection">{props.body}</div>
      </div>
    </div>
  );
}
