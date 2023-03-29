import PopupWithForm from "./PopupWithForm";

function ConfirmPopup (props) {

  function handleSubmit(e) {
    e.preventDefault();
    props.onDeleteCard();
  }

  return(
    <PopupWithForm
      title="Вы уверены?"
      name="confirm"
      buttonText="Да"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    />
  )
}
export default ConfirmPopup;