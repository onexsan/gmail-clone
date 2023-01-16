<template>
  <button @click="selectScreen('inbox')"
          :disabled="selectedScreen == 'inbox'">Inbox</button>
  <button @click="selectScreen('archive')"
          :disabled="selectedScreen == 'archive'">Archived</button>

  <BulkActionBar :emails="filteredEmails" :selectedScreen="selectedScreen" />

  <table class="mail-table">
    <tbody>
      <template v-if="filteredEmails.length">
        <tr v-for="email in filteredEmails"
            :key="email.id"
            :class="['clickable', email.read ? 'read' : '']">
          <td>
            <input type="checkbox"
                   @click="emailSelection.toggle(email)"
                   :checked="emailSelection.emails.has(email)" />
          </td>
          <td @click="openEmail(email)">{{email.from}}</td>
          <td @click="openEmail(email)">
            <p><strong>{{email.subject}}</strong> - {{email.body}}</p>
          </td>
          <td class="date" @click="openEmail(email)">
            {{format(new Date(email.sentAt), 'MMM do yyyy')}}
          </td>
          <td>
            <button v-if="!email.archived" @click="handleArchive(email, true)">Archive</button>
            <button v-else @click="handleArchive(email, false)">Unarchive</button>
          </td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td colspan="5">
            Oops! No emails are found :(
          </td>
        </tr>
      </template>
    </tbody>
  </table>

  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script lang="ts">
  import { format } from 'date-fns';
  import MailView from '@/components/MailView.vue';
  import ModalView from '@/components/ModalView.vue';
  import BulkActionBar from '@/components/BulkActionBar.vue';
  import { defineComponent, reactive, ref } from 'vue';
  import useEmailSelection from '@/composables/use-email-selection'
  import { useEmailStore } from '@/stores/EmailStore'
  import type { EmailList, Email } from '../types';

  type SelectedScreen = 'inbox' | 'archive'

  export default defineComponent({
    setup(){
      // let {data: emails} = await axios.get('http://localhost:3000/emails')
      let emailStore = useEmailStore()
      let emails = emailStore.emails
      return {
        emailSelection: useEmailSelection(),
        format,
        emails: ref<EmailList>(emails),
        openedEmail: ref<Email | null>(null),
        selectedScreen: ref<SelectedScreen>('inbox'),
        emailStore
      }
    },
    components: {
      MailView,
      ModalView,
      BulkActionBar,
    },
    computed: {
      sortedEmails(): EmailList {
        return this.emails.sort((e1, e2) => {
          return e1.sentAt < e2.sentAt ? 1 : -1
        })
      },
      filteredEmails(): EmailList {
        if(this.selectedScreen == 'inbox') {
          return this.sortedEmails.filter(e => !e.archived)
        } else {
          return this.sortedEmails.filter(e => e.archived)
        }
      }
    },
    methods: {
      selectScreen(newScreen: SelectedScreen) {
        this.selectedScreen = newScreen
        this.emailSelection.clear()
      },
      openEmail(email: Email) {
        this.openedEmail = email
        if(email) {
          email.read = true
          this.updateEmail(email)
        }
      },
      handleArchive(email: Email, value: boolean) {
        email.archived = value
        this.updateEmail(email)
      },
      changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex}: {toggleRead: boolean, toggleArchive: boolean, save: boolean, closeModal: boolean, changeIndex: number}) {
        let email = this.openedEmail
        if(toggleRead) { if (email) email.read = !email.read }
        if(toggleArchive) { if (email) email.archived = !email.archived }
        if(save) { email && this.updateEmail(email) }
        if(closeModal) { this.openedEmail = null }
        if(changeIndex) {
          let emails = this.filteredEmails
          let currentIndex = this.openedEmail && emails.indexOf(this.openedEmail)
          let newEmail = currentIndex && emails[currentIndex + changeIndex]
          newEmail && this.openEmail(newEmail)
        }
      },
      updateEmail(email: Email) {
        this.emailStore.updateEmail(email)
        // axios.put(`http://localhost:3000/emails/${email.id}`, email)
      }
    }
  })
</script>