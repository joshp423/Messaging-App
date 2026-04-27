type MessagesLoadingProps = {
  loading: boolean;
};

function MessageLoading({ loading }: MessagesLoadingProps) {
  if (loading) {
    return <div className="loadingPreviews"></div>;
  }
}

export default MessageLoading;
