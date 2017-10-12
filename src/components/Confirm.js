import ElementUI from 'element-ui'
const MessageBox = ElementUI.MessageBox

export default async function Confirm (message, title) {
  try {
    const confirm = await MessageBox.confirm(message, title, {
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    })
    return confirm === 'confirm'
  } catch (e) {
    return false
  }
}
