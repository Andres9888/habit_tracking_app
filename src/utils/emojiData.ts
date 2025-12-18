export interface EmojiCategory {
  category: string;
  icon: string;
  id: string;
  emojis: string[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    category: 'Frequent',
    icon: '🕐',
    id: 'frequent',
    emojis: [], // Will be populated dynamically based on usage
  },
  {
    category: 'Smileys',
    icon: '😊',
    id: 'smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
      '🤧', '🥵', '🥶', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐',
    ],
  },
  {
    category: 'Gestures',
    icon: '👍',
    id: 'gestures',
    emojis: [
      '👋', '🤚', '🖐', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
      '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻',
    ],
  },
  {
    category: 'People',
    icon: '👤',
    id: 'people',
    emojis: [
      '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓',
      '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇',
      '🤦', '🤷', '💆', '💇', '🚶', '🧍', '🧎', '🏃', '💃', '🕺',
      '🕴', '👯', '🧖', '🧗', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏄',
      '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵', '🤸', '🤼', '🤽', '🤾',
      '🤹', '🧘', '🛀', '🛌', '👭', '👫', '👬', '💏', '💑', '👪',
    ],
  },
  {
    category: 'Activities',
    icon: '⚽',
    id: 'activities',
    emojis: [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
      '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁',
      '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️',
      '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️',
      '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵',
      '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🎗️', '🎫', '🎟️',
    ],
  },
  {
    category: 'Nature',
    icon: '🌳',
    id: 'nature',
    emojis: [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
      '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇',
      '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
      '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕',
      '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
      '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛',
      '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖',
      '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈',
      '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨',
      '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🐾', '🐉', '🐲',
      '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍',
      '🎋', '🍃', '🍂', '🍁', '🍄', '🐚', '🌾', '💐', '🌷', '🌹',
      '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚',
      '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎',
      '🌍', '🌏', '🪐', '💫', '⭐', '🌟', '✨', '⚡', '☄️', '💥',
    ],
  },
  {
    category: 'Food',
    icon: '🍎',
    id: 'food',
    emojis: [
      '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏',
      '🍐', '🍑', '🍒', '🍓', '🥝', '🍅', '🥥', '🥑', '🍆', '🥔',
      '🥕', '🌽', '🌶️', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜',
      '🌰', '🍞', '🥐', '🥖', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖',
      '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯',
      '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🥣', '🥗', '🍿', '🧈',
      '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠',
      '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀',
      '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂',
      '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛',
      '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂',
      '🥃', '🥤', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪',
    ],
  },
  {
    category: 'Travel',
    icon: '✈️',
    id: 'travel',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
      '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️',
      '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃',
      '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊',
      '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁',
      '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧',
      '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️',
      '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️',
      '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭',
      '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩',
    ],
  },
  {
    category: 'Objects',
    icon: '💡',
    id: 'objects',
    emojis: [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️',
      '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
      '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️',
      '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋',
      '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴',
      '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️',
      '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨',
      '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮',
      '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊',
      '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻',
      '🚽', '🚰', '🚿', '🛁', '🛀', '🧼', '🪒', '🧽', '🧴', '🛎️',
      '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🖼️', '🛍️', '🛒', '🎁',
      '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '🧧', '✉️',
      '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫',
      '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊',
      '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️',
      '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒',
      '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎',
      '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️',
      '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓',
    ],
  },
  {
    category: 'Symbols',
    icon: '❤️',
    id: 'symbols',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
      '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐',
      '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
      '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳',
      '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️',
      '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️',
      '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️',
      '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓',
      '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️',
      '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠',
      'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂',
      '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶',
      '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒',
      '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣',
      '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸️', '⏯️',
      '⏹️', '⏺️', '⏭️', '⏮️', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼',
      '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️',
      '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃',
      '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️',
      '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜',
      '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫',
      '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲',
      '▪️', '▫️', '◾', '◽', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩',
      '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔',
      '🔕', '📣', '📢', '👁️‍🗨️', '💬', '💭', '🗯️', '♠️', '♣️', '♥️',
      '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕',
      '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟',
      '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧',
    ],
  },
  {
    category: 'Flags',
    icon: '🏁',
    id: 'flags',
    emojis: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️',
      '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶',
      '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩',
      '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴',
      '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨',
      '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴',
      '🇨🇵', '🇨🇷', '🇨🇺', '🇨🇻', '🇨🇼', '🇨🇽', '🇨🇾', '🇨🇿', '🇩🇪', '🇩🇬',
      '🇩🇯', '🇩🇰', '🇩🇲', '🇩🇴', '🇩🇿', '🇪🇦', '🇪🇨', '🇪🇪', '🇪🇬', '🇪🇭',
      '🇪🇷', '🇪🇸', '🇪🇹', '🇪🇺', '🇫🇮', '🇫🇯', '🇫🇰', '🇫🇲', '🇫🇴', '🇫🇷',
      '🇬🇦', '🇬🇧', '🇬🇩', '🇬🇪', '🇬🇫', '🇬🇬', '🇬🇭', '🇬🇮', '🇬🇱', '🇬🇲',
      '🇬🇳', '🇬🇵', '🇬🇶', '🇬🇷', '🇬🇸', '🇬🇹', '🇬🇺', '🇬🇼', '🇬🇾', '🇭🇰',
      '🇭🇲', '🇭🇳', '🇭🇷', '🇭🇹', '🇭🇺', '🇮🇨', '🇮🇩', '🇮🇪', '🇮🇱', '🇮🇲',
      '🇮🇳', '🇮🇴', '🇮🇶', '🇮🇷', '🇮🇸', '🇮🇹', '🇯🇪', '🇯🇲', '🇯🇴', '🇯🇵',
      '🇰🇪', '🇰🇬', '🇰🇭', '🇰🇮', '🇰🇲', '🇰🇳', '🇰🇵', '🇰🇷', '🇰🇼', '🇰🇾',
      '🇰🇿', '🇱🇦', '🇱🇧', '🇱🇨', '🇱🇮', '🇱🇰', '🇱🇷', '🇱🇸', '🇱🇹', '🇱🇺',
      '🇱🇻', '🇱🇾', '🇲🇦', '🇲🇨', '🇲🇩', '🇲🇪', '🇲🇫', '🇲🇬', '🇲🇭', '🇲🇰',
      '🇲🇱', '🇲🇲', '🇲🇳', '🇲🇴', '🇲🇵', '🇲🇶', '🇲🇷', '🇲🇸', '🇲🇹', '🇲🇺',
      '🇲🇻', '🇲🇼', '🇲🇽', '🇲🇾', '🇲🇿', '🇳🇦', '🇳🇨', '🇳🇪', '🇳🇫', '🇳🇬',
      '🇳🇮', '🇳🇱', '🇳🇴', '🇳🇵', '🇳🇷', '🇳🇺', '🇳🇿', '🇴🇲', '🇵🇦', '🇵🇪',
      '🇵🇫', '🇵🇬', '🇵🇭', '🇵🇰', '🇵🇱', '🇵🇲', '🇵🇳', '🇵🇷', '🇵🇸', '🇵🇹',
      '🇵🇼', '🇵🇾', '🇶🇦', '🇷🇪', '🇷🇴', '🇷🇸', '🇷🇺', '🇷🇼', '🇸🇦', '🇸🇧',
      '🇸🇨', '🇸🇩', '🇸🇪', '🇸🇬', '🇸🇭', '🇸🇮', '🇸🇯', '🇸🇰', '🇸🇱', '🇸🇲',
      '🇸🇳', '🇸🇴', '🇸🇷', '🇸🇸', '🇸🇹', '🇸🇻', '🇸🇽', '🇸🇾', '🇸🇿', '🇹🇦',
      '🇹🇨', '🇹🇩', '🇹🇫', '🇹🇬', '🇹🇭', '🇹🇯', '🇹🇰', '🇹🇱', '🇹🇲', '🇹🇳',
      '🇹🇴', '🇹🇷', '🇹🇹', '🇹🇻', '🇹🇼', '🇹🇿', '🇺🇦', '🇺🇬', '🇺🇲', '🇺🇳',
      '🇺🇸', '🇺🇾', '🇺🇿', '🇻🇦', '🇻🇨', '🇻🇪', '🇻🇬', '🇻🇮', '🇻🇳', '🇻🇺',
      '🇼🇫', '🇼🇸', '🇽🇰', '🇾🇪', '🇾🇹', '🇿🇦', '🇿🇲', '🇿🇼',
    ],
  },
];

// Helper function to get all emojis as a flat array
export const getAllEmojis = (): string[] => {
  return EMOJI_CATEGORIES.flatMap((category) => category.emojis);
};

// Emoji keyword mappings for better search
const EMOJI_KEYWORDS: Record<string, string[]> = {
  // Smileys
  '😀': ['smile', 'happy', 'grin'],
  '😃': ['smile', 'happy', 'grin', 'open'],
  '😄': ['smile', 'happy', 'grin', 'laugh'],
  '😁': ['smile', 'happy', 'grin', 'teeth'],
  '😆': ['laugh', 'happy', 'squint'],
  '😅': ['sweat', 'nervous', 'laugh'],
  '🤣': ['laugh', 'lol', 'rofl', 'funny'],
  '😂': ['laugh', 'cry', 'tears', 'joy', 'funny'],
  '🙂': ['smile', 'slight'],
  '😊': ['smile', 'blush', 'happy'],
  '😇': ['angel', 'innocent', 'halo'],
  '🥰': ['love', 'hearts', 'adore'],
  '😍': ['love', 'heart', 'eyes'],
  '🤩': ['star', 'excited', 'wow'],
  '😎': ['cool', 'sunglasses'],
  '🤓': ['nerd', 'glasses', 'geek'],
  // Gestures
  '👋': ['wave', 'hello', 'hi', 'bye'],
  '👍': ['thumbs', 'up', 'yes', 'good', 'ok', 'like'],
  '👎': ['thumbs', 'down', 'no', 'bad', 'dislike'],
  '👏': ['clap', 'applause', 'congrats'],
  '🙌': ['hands', 'celebrate', 'praise', 'hooray'],
  '🙏': ['pray', 'please', 'thanks', 'hope', 'grateful'],
  '💪': ['muscle', 'strong', 'strength', 'workout', 'gym', 'flex', 'bicep'],
  '✊': ['fist', 'punch', 'power'],
  '✌️': ['peace', 'victory', 'v'],
  '🤙': ['call', 'hang', 'loose', 'shaka'],
  '✍️': ['write', 'writing', 'pen'],
  // Hearts & Love
  '❤️': ['heart', 'love', 'red'],
  '🧡': ['heart', 'orange'],
  '💛': ['heart', 'yellow'],
  '💚': ['heart', 'green'],
  '💙': ['heart', 'blue'],
  '💜': ['heart', 'purple'],
  '🖤': ['heart', 'black'],
  '🤍': ['heart', 'white'],
  '💔': ['heart', 'broken'],
  '💕': ['hearts', 'love'],
  '💖': ['heart', 'sparkle'],
  '💗': ['heart', 'growing'],
  // Activities & Fitness
  '🏃': ['run', 'running', 'jog', 'exercise', 'cardio'],
  '🚶': ['walk', 'walking', 'step'],
  '🧘': ['yoga', 'meditate', 'meditation', 'zen', 'mindful'],
  '🏋️': ['gym', 'workout', 'lift', 'weight', 'exercise', 'fitness'],
  '🚴': ['bike', 'cycle', 'cycling', 'bicycle'],
  '🏊': ['swim', 'swimming', 'pool'],
  '⛹️': ['basketball', 'ball', 'sport'],
  '🤸': ['gymnastics', 'cartwheel', 'acrobat'],
  // Nature & Weather
  '🌞': ['sun', 'sunny', 'morning', 'day'],
  '🌙': ['moon', 'night', 'evening', 'sleep'],
  '⭐': ['star', 'favorite'],
  '✨': ['sparkle', 'magic', 'special'],
  '🔥': ['fire', 'hot', 'lit', 'flame', 'streak'],
  '💧': ['water', 'drop', 'hydrate', 'drink'],
  '🌱': ['plant', 'grow', 'seed', 'sprout', 'nature'],
  '🌳': ['tree', 'nature', 'forest'],
  '🌸': ['flower', 'cherry', 'blossom', 'spring'],
  '🌺': ['flower', 'hibiscus'],
  '🌻': ['sunflower', 'flower'],
  '🍀': ['clover', 'luck', 'lucky', 'irish'],
  '⚡': ['lightning', 'energy', 'power', 'electric', 'bolt'],
  // Food & Drink
  '🍎': ['apple', 'fruit', 'healthy', 'food'],
  '🍏': ['apple', 'green', 'fruit'],
  '🍊': ['orange', 'fruit', 'citrus'],
  '🍋': ['lemon', 'citrus', 'sour'],
  '🍌': ['banana', 'fruit'],
  '🥗': ['salad', 'healthy', 'food', 'vegetable'],
  '🥑': ['avocado', 'healthy', 'food'],
  '🥦': ['broccoli', 'vegetable', 'healthy'],
  '☕': ['coffee', 'cafe', 'morning', 'drink'],
  '🍵': ['tea', 'drink', 'green'],
  '🥤': ['drink', 'soda', 'cup'],
  '💊': ['pill', 'medicine', 'vitamin', 'supplement'],
  // Objects & Learning
  '📖': ['book', 'read', 'reading', 'study'],
  '📚': ['books', 'read', 'reading', 'study', 'library'],
  '📝': ['note', 'write', 'writing', 'memo', 'journal'],
  '✏️': ['pencil', 'write', 'drawing'],
  '🖊️': ['pen', 'write'],
  '📓': ['notebook', 'journal', 'diary'],
  '🎓': ['graduate', 'study', 'education', 'school', 'learn'],
  '💡': ['idea', 'light', 'bulb', 'think', 'creative'],
  '🧠': ['brain', 'think', 'smart', 'mind', 'learn'],
  '🎯': ['target', 'goal', 'aim', 'focus', 'bullseye'],
  '🏆': ['trophy', 'win', 'winner', 'champion', 'award'],
  '🥇': ['medal', 'gold', 'first', 'win'],
  '🎨': ['art', 'paint', 'creative', 'palette'],
  '🎵': ['music', 'note', 'song'],
  '🎶': ['music', 'notes', 'song'],
  '🎸': ['guitar', 'music', 'instrument'],
  '🎹': ['piano', 'music', 'keyboard', 'instrument'],
  // Time & Sleep
  '⏰': ['alarm', 'clock', 'time', 'wake'],
  '🕐': ['clock', 'time', 'one'],
  '😴': ['sleep', 'sleepy', 'zzz', 'tired'],
  '💤': ['sleep', 'zzz', 'snore', 'rest'],
  '🛏️': ['bed', 'sleep', 'rest'],
  // Tech & Work
  '💻': ['computer', 'laptop', 'work', 'tech'],
  '📱': ['phone', 'mobile', 'cell'],
  '💼': ['briefcase', 'work', 'business', 'job'],
  '📧': ['email', 'mail', 'message'],
  // Misc
  '🚀': ['rocket', 'launch', 'fast', 'start', 'go'],
  '💯': ['hundred', 'perfect', 'score', 'complete'],
  '✅': ['check', 'done', 'complete', 'yes', 'correct'],
  '❌': ['x', 'no', 'wrong', 'cancel', 'delete'],
  '⭕': ['circle', 'zero', 'ring'],
  '🎉': ['party', 'celebrate', 'confetti', 'congrats'],
  '🎊': ['confetti', 'celebrate', 'party'],
  '🧹': ['broom', 'clean', 'sweep', 'tidy'],
  '🧼': ['soap', 'clean', 'wash'],
  '🏠': ['house', 'home'],
  '📵': ['phone', 'no', 'off', 'digital', 'detox'],
};

// Helper function to search emojis
export const searchEmojis = (query: string): string[] => {
  if (!query.trim()) {
    return getAllEmojis();
  }

  const lowerQuery = query.toLowerCase();
  const results: string[] = [];

  // Search by emoji keywords
  Object.entries(EMOJI_KEYWORDS).forEach(([emoji, keywords]) => {
    if (keywords.some((keyword) => keyword.includes(lowerQuery))) {
      results.push(emoji);
    }
  });

  // Search by category name
  EMOJI_CATEGORIES.forEach((category) => {
    if (category.category.toLowerCase().includes(lowerQuery)) {
      results.push(...category.emojis);
    }
  });

  // If no results found, return all emojis that might match the query
  if (results.length === 0) {
    // Search through all emojis and match if query is part of category
    return getAllEmojis();
  }

  return [...new Set(results)]; // Remove duplicates
};

// Get emojis by category ID
export const getEmojisByCategory = (categoryId: string): string[] => {
  const category = EMOJI_CATEGORIES.find((cat) => cat.id === categoryId);
  return category ? category.emojis : [];
};

// Popular emojis for quick access
export const POPULAR_EMOJIS = [
  '💪', '🧘', '📖', '💧', '🎨', '🏃', '🍎', '🥗', '☕', '💤',
  '🎯', '✍️', '🚴', '🧠', '🎵', '🌞', '🌙', '⚡', '🔥', '🌱',
  '🏋️', '🚶', '🧘‍♀️', '🎨', '📝', '💼', '📚', '🎓', '💡', '🏆',
  '❤️', '⭐', '✨', '🎉', '🎊', '🙏', '👍', '✅', '🚀', '💯',
];
