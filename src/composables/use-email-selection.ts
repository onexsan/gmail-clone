import { reactive } from 'vue';
import { useEmailStore } from '@/stores/EmailStore'
import type {EmailList, Email} from '@/types'

let emails = reactive(new Set<Email>())

export const useEmailSelection = function(){
  let toggle = function(email: Email) {
    if(emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }
  let clear = () => {
    emails.clear()
  }
  
  let store = useEmailStore()
  let addMultiple = (newEmails: EmailList) => {
    newEmails.forEach((email: Email) => {
      emails.add(email)
    })
  }
  let forSelected = (fn: any) => {
    emails.forEach((email: Email) => {
      fn(email);
      store.updateEmail(email)
      // axios.put(`http://localhost:3000/emails/${email.id}`, email)
    })
  }
  let markRead = () => forSelected((e: any) => e.read = true)
  let markUnread = () => forSelected((e: any) => e.read = false)
  let archive = () => { forSelected((e: any) => e.archived = true); clear() }
  let unarchive = () => { forSelected((e: any) => e.archived = false); clear() }

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive,
    unarchive
  }
}

export default useEmailSelection