<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input type="checkbox"
            :checked="allEmailsSelected"
            :class="[someEmailsSelected ? 'partial-check' : '']"
            @click="bulkSelect" />
    </span>
    <span class="buttons">
      <button @click="emailSelection.markRead"
              :disabled="[...emailSelection.emails].every(e => e.read)">
        Mark Read
      </button>
      <button @click="emailSelection.markUnread"
              :disabled="[...emailSelection.emails].every(e => !e.read)">
        Mark Unread
      </button>
      <button @click="emailSelection.archive"
              :disabled="numberSelected === 0">
        Archive
      </button>
      <button v-if="selectedScreen === 'archive'"
              @click="emailSelection.unarchive"
              :disabled="[...emailSelection.emails].every(e => !e.archived)">
        Unarchive
      </button>
    </span>
  </div>
</template>

<script lang="ts">
  import useEmailSelection from '@/composables/use-email-selection';
  import { computed, defineComponent } from 'vue'
  import type { PropType } from 'vue';
  import type {EmailList} from '@/types'

  export default defineComponent({
    setup(props){
      let emailSelection = useEmailSelection();
      let numberSelected = computed((): number => emailSelection.emails.size)
      let numberEmails = computed((): number => props.emails.length)
      let allEmailsSelected = computed((): boolean => numberSelected.value === numberEmails.value)
      let someEmailsSelected = computed((): boolean => {
        return numberSelected.value > 0 && numberSelected.value < numberEmails.value
      })
      let bulkSelect = function(): void {
        if(allEmailsSelected.value) {
          emailSelection.clear()
        } else {
          emailSelection.addMultiple(props.emails)
        }
      }
      return {
        allEmailsSelected,
        someEmailsSelected,
        bulkSelect,
        emailSelection,
        numberSelected
      }
    },
    props: {
      emails: {
        type: Array as PropType<EmailList>,
        required: true
      },
      selectedScreen: {
        type: String,
        default: 'inbox'
      }
    }
  })
</script>