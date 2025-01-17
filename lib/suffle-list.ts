export default function shuffleList(array: any) {
  // Create a shallow copy of the array
  let copiedArray = [...array]

  // Fisher-Yates shuffle algorithm
  for (let i = copiedArray.length - 1; i > 0; i--) {
    // Generate a random index
    const j = Math.floor(Math.random() * (i + 1))

    // Swap elements at indices i and j
    ;[copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]]
  }

  return copiedArray
}
