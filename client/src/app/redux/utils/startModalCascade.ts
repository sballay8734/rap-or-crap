// Modal Types
//   - Notification Modals (serverResponses, client errors)
//   - loading modal (isLoadingModal, baseModal)

//   - "Are you sure?" Modals (confirmModal)
//   - Submission result modal (result of answers)

// Here's what should happen: The loading modal should server as the base for the Notification Modals. When any async action is triggered (or at least most), the loading modal should be triggered first and the Notification Modals should render "inside" of it.

// Errors should be handled by the same methods by passing a isSuccess flag. The flag will be used to style to small modal card that slides in.

// The "Are you sure?" modals and the SubmissionResult modal are unique and should remain on their own.
