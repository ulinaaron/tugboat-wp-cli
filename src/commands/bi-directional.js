function pullOrPushComponents(actionName, components) {
    if (!components.length) {
      console.log(`Please specify at least one component to ${actionName}: -p, -u, -t, or -d`);
      return;
    }
  
    components.forEach((component) => {
      console.log(`${actionName.charAt(0).toUpperCase() + actionName.slice(1)} ${component}...`);
      // Implement logic to pull or push each component
    });
  }
  
  export { pullOrPushComponents };
  