<template>
    <!-- <sl-tree>
      <sl-tree-item v-if="orgs.length > 0"
        v-for="(org, i) in orgs"
        :key="i"
        :data-org-id="org.orgid"
        :data-type="1"
      >
        {{ org.orgname }}
        <sl-tree-item style="display: none;"></sl-tree-item>
        <sl-tree-item
          v-for="(folder, j) in getFoldersByOrg(org.orgid)"
          :key="j"
          :data-folder-id="folder.folderid"
          :data-type="2"
        >
          {{ folder.foldername }}
          <sl-tree-item></sl-tree-item>
        </sl-tree-item>
      </sl-tree-item>
    </sl-tree> -->
  <div>
    <v-treeview
      :active.sync="active"
      :items="orgsAsTree"
      :open.sync="open"
      @update:open="test()"
      activatable
      open-on-click
      dense
      transition
    >
      <template v-slot:prepend="{ item }">
        <Loading v-if="loading" />
      </template>
    </v-treeview>
  </div>
  </template>
  
  <script>
  import Loading from '~/components/Loading.vue'

  export default {
    name: 'FolderTreeComponent',

    async mounted() {
      // let treeItems;
      // const waitForTreeItem = () => {
      //   treeItems = document.querySelectorAll('sl-tree-item');
      //   if (treeItems.length > 0) {
      //     treeItems.forEach(item => {
      //       item.addEventListener('sl-expand', (event) => {
      //         let type = event.target.getAttribute('data-type');
      //         type == '1' ? this.loadOrgContent(event) : this.loadFolderContent(event);
      //       });
      //     });
      //   } else {
      //     setTimeout(waitForTreeItem, 100);
      //   }
      // };
      // waitForTreeItem();
    },

    components: {
      Loading,
    },

    data () {
        return {
          loading: false,
          active: [],
          open: [],
          users: [],
          items: [
            {
              id: 1,
              name: 'Andrew',
              children: [
                {
                  id: 2,
                  name: 'Noah',
                }
              ]
            }
          ],
        }
    },

    methods: {
      test () {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 3000);
      },

      async loadOrgContent(org) {
        // let id = event.target.getAttribute("data-org-id")
        // console.log(id)
        this.loading = true
        await this.$store.dispatch('users/getOrgContent', {
          orgid: org.orgid
        })
        this.loading = false
      },

      async loadFolderContent(event) {
        let id = event.target.getAttribute("data-folder-id")
        return await this.$store.dispatch('users/getFolderContent', {
          folderid: id
        })
      },

      async fetchUsers (item) {
        return fetch('https://jsonplaceholder.typicode.com/users')
          .then(res => res.json())
          .then(json => (item.children.push(...json)))
          .catch(err => console.warn(err))
      },

      getFoldersByOrg(orgId) {
        return this.orgContentFolders.filter(folder => folder.orgid === orgId);
      },
    },

    computed: {
      orgs() {
        return this.$store.state.users.orgs;
      },

      orgsAsTree () {
        this.orgs.forEach(org => {
          org.id = org.orgid
          org.name = org.orgname
          org.children = [{}]
        });
        return this.orgs
      },

      orgContentFolders () {
        return this.$store.state.users.orgContentFolders;
      },

      items () {
        return [
          {
            name: 'Users',
            children: this.users,
          },
        ]
      },

      selected () {
        if (!this.active.length) return undefined

        const id = this.active[0]

        return this.users.find(user => user.id === id)
      },
    },
  };
  </script>
  