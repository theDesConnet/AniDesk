import './app.css';
import App from './App.svelte';
import { mount } from 'svelte';

mount(App, {
    target: document.body
});

export default App;