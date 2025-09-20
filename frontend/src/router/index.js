import { createRouter, createWebHistory } from 'vue-router'
import SuperheroList from '../pages/SuperheroList.vue'
import SuperheroDetail from '../pages/SuperheroDetail.vue'
import SuperheroForm from '../pages/SuperheroForm.vue'


const routes = [
    { path: '/', name: 'Home', component: SuperheroList },
    { path: '/create', name: 'Create', component: SuperheroForm },
    { path: '/edit/:id', name: 'Edit', component: SuperheroForm, props: true },
    { path: '/superheroes/:id', name: 'Detail', component: SuperheroDetail, props: true }
]


const router = createRouter({ history: createWebHistory(), routes })
export default router