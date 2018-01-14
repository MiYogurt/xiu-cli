
async function shell(task, shell) {
     await shell(task.shell);
     return false;
}

export default shell