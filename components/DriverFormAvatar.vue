<template>
  <v-layout row class="px-3 pt-1">
    <v-layout column align-content-space-between>
      <v-flex>Аватар</v-flex>
      <v-flex>
        <span v-if="item.image" @click="removeImage" class="avatar-link avatar-link-red">Удалить</span>
      </v-flex>
    </v-layout>
    <v-label for="avatar">
      <v-avatar size="100" color="grey lighten-2" style="cursor: pointer">
        <v-progress-circular v-if="isLoading" indeterminate></v-progress-circular>
        <img v-if="hasImage && !isLoading" :src="formData.uploadFileData || item.image" />
      </v-avatar>
      <input type="file" class="d-none" id="avatar" @change="onFileChange" />
    </v-label>
  </v-layout>
</template>

<script>
export default {
  props: ["item"],
  data() {
    return {
      isLoading: false,
      formData: {
        uploadFileData: null
      }
    };
  },
  computed: {
    hasImage() {
      return this.formData.uploadFileData || this.item.image;
    }
  },
  methods: {
    async onFileChange(e) {
      if (e.target.files && e.target.files.length) {
        let file = e.target.files[0];

        await this.uploadImage(file);
      } else {
        await this.removeImage();
      }
    },
    async uploadImage(file) {
      this.isLoading = true;
      let formData = new FormData();
      formData.append("avatar", file);
      let { data } = await this.$axios.post("/api/drivers/set_image/" + this.item._id, formData, {
        headers: { enctype: "multipart/form-data" }
      });
      let filename = data
      let reader = new FileReader();
      reader.onload = e => {
        this.formData.uploadFileData = e.target.result;
      };
      reader.readAsDataURL(file);
      this.item.image = filename
      this.isLoading = false;
    },
    async removeImage() {
      this.isLoading = true;
      await this.$axios.post("/api/drivers/remove_image/" + this.item._id);
      this.item.image = "";
      this.formData.uploadFileData = null;
      this.isLoading = false;
    },
    clear() {
      this.formData.uploadFileData = null;
    }
  }
};
</script>

<style scoped>
.avatar-link {
  cursor: pointer;
}
.avatar-link:hover {
  color: #666;
}
.avatar-link:active {
  color: #333;
}
.avatar-link-red {
  color: red;
}
.avatar-link-red:hover {
  color: #d00;
}
.avatar-link-red:active {
  color: #600;
}
</style>