// Stock photographs on the landings, with their credits. Added 2026-09-11.
//
// Chosen from Pexels through lib/pexels.js (server side, never the browser),
// cropped and re-encoded to WebP under 200 KB in public/landing/ (on-page-seo
// §9). Pexels asks for visible credit where possible, so every entry carries
// the photographer and the photo page, and `PhotoCredit` prints them beside
// the image. Direction per DESIGN_RULES §5: documentary, someone doing a
// concrete piece of back-office work, nobody looking at the camera.
//
// Only photo slots take these. A `ScreenSlot` is for a product screen and never
// takes stock (DESIGN_RULES §16, §19).

export const PHOTOS = {
  formsHands: {
    src: "/landing/px-forms-hands.webp",
    width: 1600,
    height: 1000,
    alt: "Hands filling in paper forms at a desk",
    photographer: "Mahyub Hamida",
    url: "https://www.pexels.com/photo/doctor-filling-out-medical-documents-in-tinduf-30313813/",
  },
  followupCall: {
    src: "/landing/px-followup-call.webp",
    width: 960,
    height: 1200,
    alt: "A man on the phone taking notes at a desk, a laptop and folders beside him",
    photographer: "Andrea Piacquadio",
    url: "https://www.pexels.com/photo/photo-of-man-in-blue-suit-jacket-striped-shirt-and-eyeglasses-talking-on-the-phone-while-sitting-at-a-table-with-his-laptop-3760604/",
  },
  bindersDesk: {
    src: "/landing/px-binders-desk.webp",
    width: 1000,
    height: 1000,
    alt: "A woman at an office desk between shelves of binders, on the phone, hand to her forehead",
    photographer: "Anna Tarazevich",
    url: "https://www.pexels.com/photo/woman-sitting-behind-her-desk-having-a-telephone-call-5196818/",
  },
  phoneDesk: {
    src: "/landing/px-phone-desk.webp",
    width: 1200,
    height: 800,
    alt: "A man at a desk by a window, holding a phone and reading from a tablet",
    photographer: "Karolina Grabowska",
    url: "https://www.pexels.com/photo/a-man-sitting-at-a-desk-looking-at-a-tablet-while-holding-a-phone-6334148/",
  },
};
