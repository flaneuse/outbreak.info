<template>
  <div style="min-height: 75vh;">
    <div class="row m-0">
      <div
        class="col-sm-12 bg-light d-flex justify-content-center align-items-center my-5"
      >
        <div class="container">
          <h1>Contributing Data Resources</h1>
          <p class="text-left">
            Outbreak.info currently contains {{ types.length }} types of
            resources:
            <span v-for="(type, idx) in types" :key="idx">
              <router-link
                :to="{ name: 'Resources', query: { filter: '@type:' + type.id } }"
                >{{ type.label }}</router-link
              >
              <span v-if="idx < types.length - 2">, </span>
              <span v-if="idx == types.length - 2">, and </span> </span
            >.
            <router-link :to="{ name: 'Sources' }" class="text-left"
              >Learn more about our data sources</router-link
            >.
          </p>
          <p class="text-left">
            Since are resources come from so many different sources, we ensure
            that their metadata (a description of what's contained within the
            data source) complies to common schema to promote finadbility and
            interoperabilty. Each resource's schema is based on schemas
            developed by
            <a href="https://schema.org" target="_blank" rel="noreferrer"
              >schema.org</a
            >, a project which provides web standards to describe different
            types of data.
            <a
              href="https://discovery.biothings.io/view/outbreak/"
              target="_blank"
              rel="noreferrer"
              >View our schemas</a
            >.
          </p>
        </div>
      </div>
    </div>

    <div class="container">
      <h4 class="text-left">How to contribute data</h4>
      <p class="text-left">
        Check back later for more information on how to contribute data. In the meantime, you're welcome to fill out a
        <a href="https://github.com/SuLab/outbreak.info-resources/issues/new?assignees=&labels=&template=suggest-a-new-resource.md&title=%5BSOURCE%5D" target="_blank" rel="noreferrer">
          Github Issue</a> to request adding a new source or send an email to <a href="mailto:help@outbreak.info?subject=Data Source">help@outbreak.info</a>.
      </p>
    </div>

    <!-- <div class="container">
      <h4 class="text-left">How to contribute data</h4>
      <div class="row mb-2 d-flex">
        <router-link to="#curate" class="col-sm-4">
          <div class="card card-link h-100 mx-2 px-1 py-3">
            <h5>Curate data</h5>
            <p>
              Edit existing metadata records
            </p>
          </div>
        </router-link>

        <router-link to="#add-metadata" class="col-sm-4">
          <div class="card card-link h-100 mx-2 px-1 py-3">
            <h5>Add metadata for a source</h5>
            <p>
              Create a metadata record for a new source
            </p>
          </div>
        </router-link>

        <div class="col-sm-4">
          <div class="card card-link h-100 mx-2 px-1 py-3">
            <h5>Suggest a new source to be crawled</h5>
            <p>
              Submit an issue to Github
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container text-left mt-5" id="curate">
      <h4>Curating metadata</h4>
      <div class="d-flex flex-wrap">
        <p>
          Curating metadata is key to making information about our resources
          more accurate and to increase the discoverability of data. After we
          harvest data from our various
          <router-link :to="{ name: 'Sources' }">sources</router-link>, we
          review the information and add additional
          <a
            href="https://github.com/SuLab/outbreak.info-resources/blob/master/covid_topic_categories.tsv"
            target="_blank"
            rel="noreferrer"
            >tags</a
          >.
        </p>
      </div>
    </div>

    <div class="container text-left mt-5" id="add-metadata">
      <h4>Adding metadata</h4>
      <div class="d-flex flex-wrap">
        <div
          class="my-3 card card-dde p-5 mr-3"
          v-for="(type, idx) in types"
          :key="idx"
        >
          <h6>
            {{ type.label }}
          </h6>
          <div>
            {{ type.description }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { mapState } from "vuex";

export default Vue.extend({
  name: "Contributing",
  components: {},
  computed: {
    ...mapState("admin", ["resources"])
  },
  data() {
    return {
      types: [
        // {
        //   label: "Protocols",
        //   description:
        //     "A detailed series of instructions to perform an experimental technique and/or analysis",
        //   id: "Protocol"
        // },
        {
          label: "Clinical Trials",
          description: "Publicly and privately funded human clinical studies",
          id: "ClinicalTrial"
        },
        {
          label: "Datasets",
          description: "A collection of primary or secondary data",
          id: "Dataset"
        },
        // {
        //   label: "Analyses",
        //   description:
        //     "Web-based resources that interpret data based off assumptions and frequently update with new data",
        //   id: "Analysis"
        // },

        {
          label: "Publications",
          description:
            "A published report, set of results, or commentary, including preprints and blog posts",
          id: "Publication"
        }
      ]
    };
  }
});
</script>

<style lang="scss">
.card-link {
  background: $primary-color;
  color: white;
}
.card-dde {
  max-width: 200px;
}
</style>