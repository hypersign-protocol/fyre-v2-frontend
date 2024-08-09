import { useGtag } from "vue-gtag-next";
const { event } = useGtag()


const logGtag = async(data: any, eventType: string, eventCategory: string) => {

    if(typeof data === 'object' && data !== null)
    {
      data = JSON.stringify(data);
    } else if(data == null) {
        data = ''
    }
    
    if(!eventCategory) {
        eventCategory = eventType
    }
    event(eventType,{
      'event_category': eventCategory,
      'event_label': data
    })
  }

  export default logGtag
