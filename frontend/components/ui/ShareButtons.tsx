import Image from 'next/image';


interface ShareButtonsProps {
  content: string;
}

export default function ShareButtons({ content }: ShareButtonsProps) {
  const shareButtons = [
    {
      name: 'WhatsApp',
      icon: '/icons/whatsapp.svg',
      onClick: () => window.open(`https://wa.me/?text=${encodeURIComponent(content)}`)
    },
    {
      name: 'Facebook',
      icon: '/icons/facebook.svg',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content)}`)
    },
    {
      name: 'Twitter',
      icon: '/icons/twitter.svg',
      onClick: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`)
    },
    {
      name: 'LinkedIn',
      icon: '/icons/linkedin.svg',
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content)}`)
    },
    {
      name: 'Email',
      icon: '/icons/email.svg',
      onClick: () => window.location.href = `mailto:?body=${encodeURIComponent(content)}`
    }
  ];

  return (
    <div className="mt-4 flex justify-center space-x-4">
      {shareButtons.map((button) => (
        <button
          key={button.name}
          onClick={button.onClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={`Share on ${button.name}`}
        >
          <Image
            src={button.icon}
            alt={button.name}
            width={24}
            height={24}
          />
        </button>
      ))}
    </div>
  );
}