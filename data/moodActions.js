const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    mimoso: [
        {
            label: 'Acariciar',
            value: 'pat',
            embed: {
                color: '#7e0404',
                title: '🐯🐶 Una linda caricia de parte de {author}',
                description: '{author} acarició con cariño a {target} 💞',
                images: [
                    'https://preview.redd.it/petting-session-randitawu-v0-l1txwlujsmne1.jpeg?width=640&crop=smart&auto=webp&s=8bab6a8d2464fd135ae888bc44d50aa469615dda',
                    'https://external-preview.redd.it/petting-overload-zempy3-v0-LODpqerJCK2TG0VsnrdsXoqC8WAhYsPF7RI-8hslxJc.png?width=1080&crop=smart&auto=webp&s=50222b5047952755f57cee6e8427cc928222a8a0',
                    'https://scontent.feoh3-1.fna.fbcdn.net/v/t39.30808-6/577135181_842790888327563_634573314472143491_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=13d280&_nc_ohc=TY0gbkUM0REQ7kNvwF_ktTZ&_nc_oc=AdmSOJXo7lRCj2fCSr8pWGO7P6ejbcmreH-zPnYfm2AkpeEpPs4UwKJbV_ffyyFJFPu2kKF3ZOGH3vqu_TKbwgxo&_nc_zt=23&_nc_ht=scontent.feoh3-1.fna&_nc_gid=nLYQm37Pk6HaP1CyTBIsiQ&_nc_ss=8&oh=00_AfxyzMjnb-st4CUxGAWvu2LjZYLg5PvCb9VKaGgimMs-zA&oe=69AE9B44',
                    'https://scontent.feoh3-1.fna.fbcdn.net/v/t39.30808-6/579159864_842783821661603_1458565516172547961_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=3xPISXHHYQ4Q7kNvwHNwWy8&_nc_oc=AdkvDqx1yzqhMwSSMYB_nVzX_Q2MzpB04tkNbf5q-2rlNvXVhCVmFjkYHhU8N0kzMfgf7dCYbvoRXfNmXQR-XkjC&_nc_zt=23&_nc_ht=scontent.feoh3-1.fna&_nc_gid=v5waPsKNb_KqVRnyaw7qmQ&_nc_ss=8&oh=00_Afx8lUKfpMCGZ3nu_i0nUvrklk2MH3aJS6uXTQp8CM6lrQ&oe=69AEBE2F',
                    'https://pbs.twimg.com/media/EyJpFhnW8AYnmU6.jpg',
                    'https://d.furaffinity.net/art/sabby/1683950100/1683950100.sabby_dfwq8x2-0c507e46-679f-445e-97a7-58150c16645d.png',
                    'https://d.furaffinity.net/art/zawmg/1495272462/1495272462.zawmg_big_pawbs.png'
                ],
                footer: 'Los mimos nunca sobran 🐯🐶'
            }
        },
        {
            label: 'Acurrucar',
            value: 'acurrucar',
            embed: {
                color: '#7e0404',
                title: '🐶🐯 Acurrucados',
                description: '{author} se acurrucó con {target} 💕',
                images: [
                    'https://i.pinimg.com/736x/26/05/fb/2605fb43b462ce126a729e6cde5ab95c.jpg',
                    'https://i.pinimg.com/736x/cb/19/57/cb1957fd32fe96e156fda58b4be236db.jpg',
                    'https://i.pinimg.com/736x/af/10/9d/af109d280d7385b27e1cb143fc73d56c.jpg',
                    'https://i.pinimg.com/736x/59/d5/72/59d572aac500f903744e93c79d187fbe.jpg',
                    'https://i.pinimg.com/736x/3c/70/26/3c7026f3610d40d40967feb104e95cae.jpg',
                    'https://i.pinimg.com/736x/9e/1c/9f/9e1c9f7911110165beaa5e5fea193f7b.jpg',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479292796396507278/G5wkltNXkAAZJ4Y.jpg?ex=69ad7c86&is=69ac2b06&hm=225e4a10357170ab47a4aca639e9d1df7cc0ec1127452f598f66e1cdf6369387&=&format=webp&width=544&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1480013832838713466/VVzPTRd.jpg?ex=69ae21cb&is=69acd04b&hm=d928e4c21bd643c611101ba20ba9510408c6417b69f68bd5b52b9a78e3fd674a&=&format=webp&width=1049&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1480013833199288493/45964129600-1644876007.jpg?ex=69ae21cb&is=69acd04b&hm=778b5a2ff3a83af2f08282b61019191fe5fc00ac3148f7b164946dbd2adb4956&=&format=webp'
                ],
                footer: 'Que bonito es acurrucarse con tu persona favorita -> 🐶'
            }
        }
    ],
    sumiso: [
        {
            label: 'Ponerle una correa',
            value: 'correa',
            embed: {
                color: '#ec8829',
                title: '🦮 Correa colocada 🐶',
                description: '{author} le puso una correa a {target} con firmeza 🐯🔥',
                footer: 'Al parecer alguien es un cachorrito travieso, y se ve adorable! 🐾',
                images: ['https://static1.e621.net/data/sample/8b/ce/8bce3559212bc0a34b0039b177623152.jpg',
                    'https://static1.e621.net/data/sample/19/10/1910ecbf1487946f92bc69b5baf53c47.jpg',
                    'https://static1.e621.net/data/sample/18/27/182714b71514e4c46cc72cc0237f0b72.jpg',
                    'https://static1.e621.net/data/sample/e9/21/e921eff88e2fb3d6a2c22de7cda74026.jpg',
                    'https://static1.e621.net/data/sample/4f/b2/4fb222724556475a3235f1eb158616e3.jpg',
                    'https://static1.e621.net/data/sample/76/48/7648907bf3ee86d90d91560f4b1a05bd.jpg',
                    'https://static1.e621.net/data/sample/74/2b/742bd20fad9bf26d91be5d64b0deff86.jpg',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479976455869038634/G8EBO_OWoAY7d7j.jpg?ex=69adfefb&is=69acad7b&hm=285f9985cea796ba73bff92d36aea03e4c80514110eda31cbe29a91756936ed0&=&format=webp&width=484&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479292795989528606/HCqpmbfWYAAveRm.jpg?ex=69ad7c86&is=69ac2b06&hm=f96528df2946feea66d1b1d4eada7c4950bd2b07595278276b445b5342456458&=&format=webp',
                    'https://media.discordapp.net/attachments/1477571857375957064/1480007302147739830/G0OYzhoWkAALS9P.jpg?ex=69ae1bb6&is=69acca36&hm=4733598256f1a31ebe7fafd276deffafd09fa03fb0a3f6ccfea8909becc41975&=&format=webp&width=632&height=830',
                    'https://media.discordapp.net/attachments/1477571857375957064/1482207187756388382/HDNUSGybQAM4Fvu.jpg?ex=69b61c83&is=69b4cb03&hm=6725b3c88f84fb83b8a9d9c78e74caaf1278e24a1e001871b823676dceec26bb&=&format=webp'
                ]
            }
        },
        {
            label: 'Lamer',
            value: 'lick',
            embed: {
                color: '#ec8829',
                title: 'Al parecer {target} es un cachorrito delicioso 🐶',
                description: '{author} tiene órdenes claras, con su boca y tu boquita, perrito 🐶🥂',
                footer: 'al parecer alguien es un cachorrito muy sabroso 🐾',
                images: ['https://static1.e621.net/data/sample/c8/57/c8570225aef36f8c47d69189d682cb9f.jpg',
                    'https://static1.e621.net/data/sample/73/e9/73e95104d95a3a56bd47c5407bd060ce.jpg',
                    'https://static1.e621.net/data/sample/5c/7f/5c7f74833a66c59537b39be793a3c12a.jpg',
                    'https://static1.e621.net/data/sample/4b/d5/4bd5cf3c10713c5481ba93fb8cf4a44e.jpg',
                    'https://static1.e621.net/data/sample/21/a9/21a9b11a148af91b71153720979e3228.jpg',
                    'https://static1.e621.net/data/sample/53/cb/53cb2308661f2c1e0f847b2479904a6f.jpg'
                ]
            }
        },
        {
            label: 'nalguear',
            value: 'nalgada',
            embed: {
                color: '#ec8829',
                title: '🍑 Nalgada recibida',
                description: '{author} le dio una nalgada a {target} 🍑',
                footer: 'Al parecer {target} disfruta de estas atenciones 🐾',
                images: ['https://static1.e621.net/data/sample/c4/8d/c48d1097882acf15fa3398ff837702ee.jpg',
                    'https://static1.e621.net/data/sample/6a/0e/6a0e622c4a456b38f21ecbe6ee3e10fc.jpg',
                    'https://static1.e621.net/data/c7/c1/c7c16d1d23488695f14584f0e0142c95.gif',
                    'https://static1.e621.net/data/sample/e3/4d/e34d7f355579c68cb76a501825e922ca.jpg',
                    'https://static1.e621.net/data/sample/25/5f/255faf7040749ffff94d3dee179fcf15.jpg',
                    'https://static1.e621.net/data/sample/f2/8f/f28f792b149304d5b23072aaa6c1e239.jpg'
                ]
            }
        },
        {
            label: 'provocacion',
            value: 'provocar',
            embed: {
                color: '#ec8829',
                title: 'Al parecer {author} le está dando un buen show a su cachorrito! 🐯',
                description: 'Su mascotita debe sentirse muy feliz por ello 🐶',
                footer: 'Que sabroso se ve 🐯🦁',
                images: [
                    'https://media.discordapp.net/attachments/1477571857375957064/1482207217854976010/HDQiNkCbQAMlqMb.jpg?ex=69b61c8a&is=69b4cb0a&hm=1f330b718ddfa4f5f61d86575e2d9b87f56c999d5e2289b8f834b75ba32fd14c&=&format=webp',
                    'https://static1.e621.net/data/sample/a4/da/a4da29755235ad720450ab87cdaecad7.jpg',
                    'https://static1.e621.net/data/sample/8a/7d/8a7dd02398c88c6e98834ebe6a259fed.jpg',
                    'https://static1.e621.net/data/sample/99/ba/99baef219cd9fb83c0488efe3a1a2e24.jpg',
                    'https://static1.e621.net/data/sample/b3/35/b335dcfe12aac589e75b0f24c2fd5142.jpg',
                    'https://static1.e621.net/data/sample/10/df/10dfcde05c98c74de3639ba1c0790521.jpg',
                    'https://static1.e621.net/data/sample/80/b2/80b21a2e6a1a660d30d5ec4d542f5ef0.jpg',
                    'https://static1.e621.net/data/sample/0c/0b/0c0b073dcfd2badd1424c406f8b76a20.jpg',
                    'https://static1.e621.net/data/sample/bc/c8/bcc8ca6a236e0cda086e382f724de996.jpg',
                    'https://static1.e621.net/data/sample/0a/15/0a15b172daa2f3b4ff32553db0973a7d.jpg',
                    'https://static1.e621.net/data/f8/27/f827264b0235be01f37c30df0df1ffed.png'
                ]
            }
        }
    ],
    dominante: [
        {
            label: 'Arrodillarse',
            value: 'arrodillar',
            embed: {
                color: '#f97316',
                title: '{author} se arrodilló ante {target} 🐯',
                description: '{author} se arrodilló ante {target} mostrando su sumisión 🐶',
                images: ['https://static1.e621.net/data/sample/2a/be/2abe251e497591523821bec9c28d00b8.jpg',
                    'https://static1.e621.net/data/sample/8a/14/8a14cf4cecae0c5c7295ba7903cf5af4.jpg',
                    'https://static1.e621.net/data/sample/fe/99/fe992a7a27c48b25457b662b572a888d.jpg',
                    'https://static1.e621.net/data/sample/0e/cd/0ecd0155fdcccc0bb7898d4cdb62f01f.jpg',
                    'https://static1.e621.net/data/sample/ab/f3/abf32546208fed48be7d68a87de17ada.jpg',
                    'https://static1.e621.net/data/sample/2f/40/2f4082356924a40f8aefe197caa1a06a.jpg',
                    'https://static1.e621.net/data/sample/e9/08/e908173c796686e37de01c7b2de8f667.jpg',
                    'https://static1.e621.net/data/sample/0b/df/0bdfe337ebb394965373119b5a2d407c.jpg',
                    'https://static1.e621.net/data/sample/b7/8b/b78b136477563dbd6fc1b05a80c2fda3.jpg',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479976455478710355/HC1j7HLXMAAtUYF.jpg?ex=69adfefb&is=69acad7b&hm=1d08397aa47f9d4c6e6fd39b4fbcf57d912fc96783c3963889263b451096dc37&=&format=webp',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479292795989528606/HCqpmbfWYAAveRm.jpg?ex=69ad7c86&is=69ac2b06&hm=f96528df2946feea66d1b1d4eada7c4950bd2b07595278276b445b5342456458&=&format=webp',
                    'https://images-ext-1.discordapp.net/external/vPyjluI6dbuLKMG7-zwnxdKPSwrLkexeC9k5BsmpbRs/https/static1.e621.net/data/sample/2f/6a/2f6a6a24938e52b5c67775dd3ff87a42.jpg?format=webp&width=826&height=777'
                ],
                footer: 'Dominancia en curso'
            }
        },
        {
            label: 'Prepararse',
            value: 'preparar',
            embed: {
                color: '#f97316',
                title: '{author} está listo para ser usado por {target} 🐯',
                description: 'Al parecer alguien ya está preparado para su amo 🐶🐯',
                images: ['https://static1.e621.net/data/sample/8d/c9/8dc9fcaa37935c2cadbe89d4597ce9ec.jpg',
                    'https://static1.e621.net/data/d6/c3/d6c3b4b3ec17880c5d6ff0e45857544d.jpg',
                    'https://static1.e621.net/data/sample/24/02/2402704047103134610fe7d7fb61caa4.jpg',
                    'https://static1.e621.net/data/sample/24/5f/245f5c6e57b90068d7db29b9b0b4abec.jpg',
                    'https://static1.e621.net/data/sample/72/d1/72d165b55b430934b8a57ece15d66979.jpg',
                    'https://static1.e621.net/data/sample/88/15/88151705e3dcf5b86dedc4d2359a42b9.jpg',
                    'https://static1.e621.net/data/sample/6f/1b/6f1bea28ede37fc8609b0090d67860b5.jpg',
                    'https://static1.e621.net/data/sample/1a/93/1a93eeeaaf41ea78bb9981f575eef73d.jpg',
                    'https://static1.e621.net/data/sample/15/a5/15a5f9ba45a0ea75f17a8002d963908b.jpg',
                    'https://static1.e621.net/data/sample/08/5a/085ae65bee52b469232240b7fccbcb33.jpg'
                ],
                footer: 'Preparación en curso'
            }
        },
        {
            label: 'Provocación',
            value: 'provocar',
            embed: {
                color: '#f97316',
                title: '{author} provoca a {target} con intención maliciosa 🐯',
                description: '{author} provoca a {target}, al parecer alguien quiere ser tomado 🐶',
                images: ['https://static1.e621.net/data/sample/2a/be/2abe251e497591523821bec9c28d00b8.jpg',
                    'https://static1.e621.net/data/sample/e7/0a/e70a40b9c1ddd1377404bdc75558ff1b.jpg',
                    'https://static1.e621.net/data/sample/62/17/621745c7df3ae20d99cfc859fbf4f191.jpg',
                    'https://static1.e621.net/data/sample/82/97/8297e786f51a31cbc407a5e0ee416572.jpg',
                    'https://static1.e621.net/data/sample/2c/cc/2ccc6d6cc2a06e962a90367aa6445398.jpg',
                    'https://static1.e621.net/data/sample/1c/f8/1cf84641e2a34fbd8488459cdef97af9.jpg',
                    'https://static1.e621.net/data/sample/ad/43/ad4397fab177dfdd45b4d170890e3618.jpg',
                    'https://static1.e621.net/data/sample/0d/24/0d24c20e649e56f0f60f53c0a7c18400.jpg',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479965987385245861/79db80d121186755c6319f2d3cf78242.jpg?ex=69adf53b&is=69aca3bb&hm=8ecc90b8857087902d24ba74d85a2e53d02c2857a09853dc307c0969e088ba2e&=&format=webp&width=968&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479965987913863309/20250911_025335.jpg?ex=69adf53b&is=69aca3bb&hm=b93f37ca0509e96ca782b53e44ee8598ce44d283a845109f01fdb7a1ec6ed609&=&format=webp&width=726&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479965988286890125/4130f83dfe310a5f984d76003e7d4127.jpg?ex=69adf53c&is=69aca3bc&hm=a20bf04ee3e1002dbac1ada09e5ad816ce3d4b9f880b5aa18bc54d0542048866&=&format=webp&width=813&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1479124902425530398/GS7wprNbIAMDI60.jpg?ex=69ad88e9&is=69ac3769&hm=386f88aee1eaf69fcdba365a3c909fdd36b8c7cd696c1148d58e99cc5c9c7c46&=&format=webp&width=558&height=726',
                    'https://media.discordapp.net/attachments/1477571857375957064/1482207217334616135/HDIsOzLbMAAzUC8.jpg?ex=69b61c8a&is=69b4cb0a&hm=16d961a67a8f1d91612aec0e8981e4f921ca6399d313a3df5863ad739f5e9d88&=&format=webp'
                ],
                footer: 'Al parecer está funcionando 🐯🔥'
            }
        },
        {
            label: 'Lamer',
            value: 'lamer',
            embed: {
                color: '#f97316',
                title: '{author} le ha dado una buena lamida a {target} 🐯',
                description: 'vaya que {author} tiene una buena habilidad con su boquita 🐶',
                images: ['https://media.discordapp.net/attachments/1477571857375957064/1482207216898674718/HDIw_tabQAER1Xx.jpg?ex=69b61c8a&is=69b4cb0a&hm=ed49230c578e8fdf01762c2cee15dc3912b2b1c0e4d1e4efc3f0035ad3dbc6b6&=&format=webp',
                    'https://static1.e621.net/data/sample/01/10/0110f13ee0a754a7a2320f96c2f1c46d.jpg',
                    'https://static1.e621.net/data/sample/8c/66/8c66b5acfaa83cf58d896982fcf00866.jpg',
                    'https://static1.e621.net/data/sample/4b/d5/4bd5cf3c10713c5481ba93fb8cf4a44e.jpg',
                    'https://static1.e621.net/data/58/fe/58fe399c9d7ccb6b593c927623af23cf.png',
                    'https://static1.e621.net/data/sample/0d/e0/0de0adb25bedbc0639899c0ad7325abc.jpg',
                    'https://static1.e621.net/data/c2/04/c204121dda9e1c0677012c71f645f417.gif',
                    'https://static1.e621.net/data/sample/95/1c/951cba418e1f749fed0ab89e42c021d5.jpg',
                    'https://static1.e621.net/data/sample/8b/38/8b3805630643e2f2d82c1a004d47883e.jpg',
                    'https://static1.e621.net/data/sample/79/19/7919a159179db6a27481b98948d7e359.jpg',
                    'https://static1.e621.net/data/sample/c2/83/c2839e50d9e1bc402c30c4a8443dd801.jpg',
                    'https://static1.e621.net/data/sample/be/8e/be8e291ed0e9f99fa83154e19a0c0c37.jpg',
                    'https://media.discordapp.net/attachments/1477571857375957064/1482217834640838656/a30db1532b5fc058a44d8e708f4f871c.jpg?ex=69b6266e&is=69b4d4ee&hm=3d51a9bf0fa3ccf1793dc65e4807228e20f4c2514ce9824de315c15c1a1821be&=&format=webp',
                    'https://media.discordapp.net/attachments/1477571857375957064/1482217835131437097/da53a6b5ec11d4c078e4afd699cb3f98.jpg?ex=69b6266e&is=69b4d4ee&hm=3ac26978b73afeab43df4c46d89d20d40e491ffa9813bf0147062f78151ed988&=&format=webp&width=561&height=726',
                    'https://static1.e621.net/data/67/9b/679bda4a4ebd4dcc049ff28bc62a896c.gif',
                    'https://static1.e621.net/data/84/bb/84bb00985d87c6351a9720ada8c6259c.gif'
                ],
                footer: 'Se nota que tu dueño lo disfruta 🐯🔥'
            }
        }
    ],
    needy: [
        {
            label: 'Abrazo',
            value: 'abrazo',
            embed: {
                color: '#7e0404',
                title: 'Tu cachorrito / dueño te ha dado un abrazo 🐶🐯',
                description: '{author} está dándole mimos intensivos a {target} 🐯🐶',
                images: ['https://i.pinimg.com/736x/0e/f0/82/0ef082c09737eeb93e3557ff8a559c60.jpg',
                    'https://i.pinimg.com/736x/fe/0d/59/fe0d59c2d417be8721aa9bb16cf98e93.jpg',
                    'https://i.pinimg.com/736x/86/8c/04/868c04701c4bca105fb8d463ec2257cc.jpg',
                    'https://i.pinimg.com/736x/61/43/a7/6143a79a6a38f550236bac5cbfe97ef6.jpg',
                    'https://i.pinimg.com/736x/19/00/1a/19001abf8ba15341158b8a25735a1176.jpg',
                    'https://i.pinimg.com/736x/43/70/3c/43703cd2be388729943f9f0370284449.jpg',
                    'https://i.pinimg.com/736x/56/0e/c8/560ec8e8a5c34fa6affc2538b172bc72.jpg',
                    'https://i.pinimg.com/736x/b8/9b/dd/b89bddb1d36550483caf9a10641dba62.jpg',
                    'https://media.discordapp.net/attachments/1477571857375957064/1482207188276744282/HDMozU1bQAIvihT.jpg?ex=69b61c83&is=69b4cb03&hm=bcb6ad2357c0047333bf3ac97a0662c457697f70849ba45817acac1168e02a87&=&format=webp'
                ],
                footer: 'No ignores estos ojitos'
            }
        },
        {
            label: 'Besitos',
            value: 'besitos',
            embed: {
                color: '#7e0404',
                title: '{author} ha dado besitos a {target} 🐶🐯',
                description: '{author} está dándole besitos a {target} 🐯🐶',
                images: ['https://i.pinimg.com/736x/6e/b7/b3/6eb7b375303f9b6d57db5f6169d95658.jpg',
                    'https://i.pinimg.com/736x/c5/34/49/c53449f7869c1f7fd4afb2c6b5f4d922.jpg',
                    'https://i.pinimg.com/736x/92/f3/9e/92f39e728273360c86d97deda306d6cc.jpg',
                    'https://i.pinimg.com/736x/b3/d3/34/b3d334603270a856c65df940c3ba5cc3.jpg',
                    'https://i.pinimg.com/736x/9d/9d/3b/9d9d3bbe91ebc45bad970b38057ed297.jpg',
                    'https://scontent.feoh3-1.fna.fbcdn.net/v/t1.6435-9/133504492_3117936701641786_6944475894296073849_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=E8WrljHdnPsQ7kNvwH4mbvw&_nc_oc=AdkYrvXfsSaF0j-js7Gil3txirRDmW4VVByPZnSulTpoLvsrS9Rn9gNVRGNju-eYEvgJNU472jA-pyioioRxtkDF&_nc_zt=23&_nc_ht=scontent.feoh3-1.fna&_nc_gid=j9k52QGFzJLLFOSPcKLUEg&_nc_ss=8&oh=00_AfxLbE3I9Ya67037U00nMPAjEQme6DPXsvuOm7c_e2ABgw&oe=69D06634',
                    'https://d.furaffinity.net/art/poof-poof/1619630681/1619630681.poof-poof_xondarapril_s.png'
                ],
                footer: 'No ignores estos ojitos'
            }
        }
    ],
    celoso: [
        {
            label: 'Poema',
            value: 'poema',
            embed: {
                color: '#580101',
                title: '{author} ha escrito un poema para {target} 🐯',
                description: 'Entre tantos días que pasan, entre tantas horas que se escapan, entre tantas cosas que cambian, hay algo en mí que permanece cuando pienso en ti. Eres ese pensamiento suave que aparece sin avisar, esa calma que encuentro incluso cuando estás lejos. A veces me sorprende lo fácil que es quererte, como si mi corazón ya supiera tu nombre desde antes. Y si alguna vez dudas, solo recuerda esto: de todas las historias que podría vivir, la que más quiero… es la que escribo contigo. ❤️',
                footer: 'Alguien está sintiendo celos, pero de una forma muy tierna 🐶🐯🥂'
            }
        },
        {
            label: 'Atencion',
            value: 'atencion',
            embed: {
                color: '#580101',
                title: '{author} se ha comprometido a ser más atento con {target} 🐯🐶',
                description: '{author} se ha dado cuenta de que no ha estado tan atento como debería con {target}, y se compromete a mejorar y darle toda la atención que merece 🐶🐯',
                images: ['https://i.pinimg.com/736x/03/11/50/031150adbc219280fd4d46b3b0521017.jpg',
                    'https://i.pinimg.com/736x/90/7b/fe/907bfe980d2d825e3bcd7b3ed046dbcc.jpg',
                    'https://i.pinimg.com/736x/b8/e5/58/b8e558ba42bfe7f416c692e5dbd82159.jpg',],
                footer: 'Alguien está sintiendo celos, pero de una forma muy tierna 🐶🐯🥂'
            }
        }
    ]
};
