import Receipt from "../components/Receipt/Receipt";

function ReceiptUpload({ navigation }) {
  function handleSubmit() {
    navigation.goBack();
  }

  return <Receipt onSubmit={handleSubmit} />;
}

export default ReceiptUpload;
