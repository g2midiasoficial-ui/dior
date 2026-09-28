import { CanvasElement, CanvasFrame, ShapeType } from '../types/miro';

export type MiroModelType =
  | 'prototype'
  | 'diagram'
  | 'table'
  | 'timeline'
  | 'kanban'
  | 'document'
  | 'slides'
  | 'engage'
  | 'talktrack';

export interface CreationTemplateResult {
  title: string;
  elements: CanvasElement[];
  frames: CanvasFrame[];
}

export function generateMiroModel(type: MiroModelType, originX: number, originY: number): CreationTemplateResult {
  const ts = Date.now();
  const uid = (prefix: string, i: number) => `${prefix}-${ts}-${i}-${Math.random().toString(36).substr(2, 4)}`;

  switch (type) {
    case 'prototype': {
      // 📱 Mobile / Web Screen Prototype
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '📱 Protótipo Mobile App - Diorfy Experience',
        x: originX,
        y: originY,
        width: 380,
        height: 720,
        backgroundColor: '#0f172a',
        borderColor: '#38bdf8',
        zIndex: 0,
      };

      const elements: CanvasElement[] = [
        // Top status bar
        {
          id: uid('shape', 1),
          type: 'shape',
          x: originX + 20,
          y: originY + 20,
          width: 340,
          height: 35,
          zIndex: 1,
          content: '9:41 📶 🔋 100%',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#1e293b',
            color: '#94a3b8',
            fontSize: 12,
            borderWidth: 0,
            textAlign: 'center',
          },
        },
        // Header card
        {
          id: uid('shape', 2),
          type: 'shape',
          x: originX + 20,
          y: originY + 65,
          width: 340,
          height: 70,
          zIndex: 1,
          content: '✨ Olá, time Diorfy!\nExplore novas possibilidades no quadro.',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            fontSize: 14,
            borderWidth: 1,
            borderColor: '#334155',
            textAlign: 'left',
          },
        },
        // Feature Hero banner
        {
          id: uid('shape', 3),
          type: 'shape',
          x: originX + 20,
          y: originY + 145,
          width: 340,
          height: 180,
          zIndex: 1,
          content: '🚀 Painel Principal de Criação\n\n• Colaboração em tempo real\n• IA Copilot integrada\n• Google Meet sincronizado',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: 14,
            borderWidth: 0,
            textAlign: 'left',
          },
        },
        // Action Sticky
        {
          id: uid('sticky', 4),
          type: 'sticky',
          x: originX + 20,
          y: originY + 340,
          width: 160,
          height: 140,
          zIndex: 2,
          content: '💡 Ideia de Feature:\nArrastar post-its com física e animações fluidas.',
          createdAt: ts,
          style: {
            backgroundColor: '#fef08a',
            color: '#1e293b',
            fontSize: 13,
          },
        },
        // Metrics Card
        {
          id: uid('sticky', 5),
          type: 'sticky',
          x: originX + 200,
          y: originY + 340,
          width: 160,
          height: 140,
          zIndex: 2,
          content: '📊 Meta Q3:\n99.9% Uptime e 100k usuários simultâneos.',
          createdAt: ts,
          style: {
            backgroundColor: '#bbf7d0',
            color: '#1e293b',
            fontSize: 13,
          },
        },
        // CTA Button
        {
          id: uid('shape', 6),
          type: 'shape',
          x: originX + 20,
          y: originY + 500,
          width: 340,
          height: 50,
          zIndex: 2,
          content: '⚡ Começar Agora',
          createdAt: ts,
          style: {
            shapeType: 'pill',
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontSize: 15,
            borderWidth: 0,
            textAlign: 'center',
          },
        },
        // Bottom Navigation Bar
        {
          id: uid('shape', 7),
          type: 'shape',
          x: originX + 20,
          y: originY + 640,
          width: 340,
          height: 60,
          zIndex: 2,
          content: '🏠 Home   |   🔍 Buscar   |   ⚡ Ações   |   👤 Perfil',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#1e293b',
            color: '#94a3b8',
            fontSize: 13,
            borderWidth: 1,
            borderColor: '#334155',
            textAlign: 'center',
          },
        },
      ];

      return {
        title: 'Protótipo Mobile',
        elements,
        frames: [frame],
      };
    }

    case 'diagram': {
      // 🔀 Flowchart / Architectural Diagram
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '🔀 Diagrama de Fluxo & Decisão',
        x: originX,
        y: originY,
        width: 860,
        height: 480,
        backgroundColor: '#ffffff',
        borderColor: '#0284c7',
        zIndex: 0,
      };

      const startId = uid('shape', 1);
      const step1Id = uid('shape', 2);
      const decisionId = uid('shape', 3);
      const actionAId = uid('shape', 4);
      const actionBId = uid('shape', 5);
      const endId = uid('shape', 6);

      const elements: CanvasElement[] = [
        // Start
        {
          id: startId,
          type: 'shape',
          x: originX + 40,
          y: originY + 180,
          width: 120,
          height: 60,
          zIndex: 1,
          content: '🟢 Início',
          createdAt: ts,
          style: {
            shapeType: 'pill',
            backgroundColor: '#dcfce7',
            borderColor: '#16a34a',
            borderWidth: 2,
            color: '#166534',
            fontSize: 14,
            textAlign: 'center',
          },
        },
        // Step 1
        {
          id: step1Id,
          type: 'shape',
          x: originX + 210,
          y: originY + 175,
          width: 150,
          height: 70,
          zIndex: 1,
          content: '⚙️ Processar Requisição',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#eff6ff',
            borderColor: '#2563eb',
            borderWidth: 2,
            color: '#1e40af',
            fontSize: 13,
            textAlign: 'center',
          },
        },
        // Decision
        {
          id: decisionId,
          type: 'shape',
          x: originX + 410,
          y: originY + 160,
          width: 130,
          height: 100,
          zIndex: 1,
          content: 'Validado?',
          createdAt: ts,
          style: {
            shapeType: 'diamond',
            backgroundColor: '#fef3c7',
            borderColor: '#d97706',
            borderWidth: 2,
            color: '#92400e',
            fontSize: 12,
            textAlign: 'center',
          },
        },
        // Branch A (Sim)
        {
          id: actionAId,
          type: 'shape',
          x: originX + 590,
          y: originY + 80,
          width: 150,
          height: 65,
          zIndex: 1,
          content: '✅ Salvar no Banco (Sim)',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#ecfdf5',
            borderColor: '#059669',
            borderWidth: 2,
            color: '#065f46',
            fontSize: 12,
            textAlign: 'center',
          },
        },
        // Branch B (Não)
        {
          id: actionBId,
          type: 'shape',
          x: originX + 590,
          y: originY + 280,
          width: 150,
          height: 65,
          zIndex: 1,
          content: '❌ Notificar Erro (Não)',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#fff1f2',
            borderColor: '#e11d48',
            borderWidth: 2,
            color: '#9f1239',
            fontSize: 12,
            textAlign: 'center',
          },
        },
        // End
        {
          id: endId,
          type: 'shape',
          x: originX + 720,
          y: originY + 180,
          width: 110,
          height: 60,
          zIndex: 1,
          content: '🏁 Fim',
          createdAt: ts,
          style: {
            shapeType: 'pill',
            backgroundColor: '#f1f5f9',
            borderColor: '#64748b',
            borderWidth: 2,
            color: '#334155',
            fontSize: 14,
            textAlign: 'center',
          },
        },
        // Connectors
        {
          id: uid('connector', 7),
          type: 'connector',
          x: originX + 160,
          y: originY + 210,
          width: 50,
          height: 1,
          zIndex: 2,
          content: '',
          createdAt: ts,
          style: {
            sourceId: startId,
            targetId: step1Id,
            borderColor: '#0284c7',
            strokeWidth: 2,
            arrowEnd: 'arrow',
          },
        },
        {
          id: uid('connector', 8),
          type: 'connector',
          x: originX + 360,
          y: originY + 210,
          width: 50,
          height: 1,
          zIndex: 2,
          content: '',
          createdAt: ts,
          style: {
            sourceId: step1Id,
            targetId: decisionId,
            borderColor: '#0284c7',
            strokeWidth: 2,
            arrowEnd: 'arrow',
          },
        },
        {
          id: uid('connector', 9),
          type: 'connector',
          x: originX + 540,
          y: originY + 180,
          width: 50,
          height: 1,
          zIndex: 2,
          content: 'Sim',
          createdAt: ts,
          style: {
            sourceId: decisionId,
            targetId: actionAId,
            borderColor: '#059669',
            strokeWidth: 2,
            arrowEnd: 'arrow',
          },
        },
        {
          id: uid('connector', 10),
          type: 'connector',
          x: originX + 540,
          y: originY + 240,
          width: 50,
          height: 1,
          zIndex: 2,
          content: 'Não',
          createdAt: ts,
          style: {
            sourceId: decisionId,
            targetId: actionBId,
            borderColor: '#e11d48',
            strokeWidth: 2,
            arrowEnd: 'arrow',
          },
        },
      ];

      return {
        title: 'Diagrama de Fluxo',
        elements,
        frames: [frame],
      };
    }

    case 'table': {
      // ⊞ Structured Table & Matrix
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '⊞ Tabela Estruturada de Tarefas & Entregas',
        x: originX,
        y: originY,
        width: 820,
        height: 400,
        backgroundColor: '#f8fafc',
        borderColor: '#10b981',
        zIndex: 0,
      };

      const columns = ['Tarefa / Entregável', 'Responsável', 'Status', 'Prioridade', 'Prazo'];
      const rows = [
        ['Arquitetura do Canvas Vetorial', 'Mariana Silva', 'Concluído 🟢', 'Alta 🔴', '15 Out'],
        ['Integração Google Meet', 'Carlos Mendes', 'Em Progresso 🟡', 'Crítica 🔴', '22 Out'],
        ['Gerador de Modelos Miro', 'Equipe Diorfy', 'Em Progresso 🟡', 'Alta 🔴', '25 Out'],
        ['Exportação PDF 4K & SVG', 'Dev Team', 'A Fazer ⚪', 'Média 🟡', '30 Out'],
      ];

      const elements: CanvasElement[] = [];

      // Header row
      columns.forEach((col, idx) => {
        elements.push({
          id: uid('shape', idx + 1),
          type: 'shape',
          x: originX + 30 + idx * 150,
          y: originY + 40,
          width: 145,
          height: 45,
          zIndex: 1,
          content: col,
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: 13,
            borderWidth: 0,
            textAlign: 'center',
          },
        });
      });

      // Data rows
      rows.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
          const isEven = rIdx % 2 === 0;
          elements.push({
            id: uid('shape', 20 + rIdx * 10 + cIdx),
            type: 'shape',
            x: originX + 30 + cIdx * 150,
            y: originY + 95 + rIdx * 55,
            width: 145,
            height: 48,
            zIndex: 1,
            content: cell,
            createdAt: ts,
            style: {
              shapeType: 'rectangle',
              backgroundColor: isEven ? '#ffffff' : '#f1f5f9',
              borderColor: '#e2e8f0',
              borderWidth: 1,
              color: '#1e293b',
              fontSize: 12,
              textAlign: cIdx === 0 ? 'left' : 'center',
            },
          });
        });
      });

      return {
        title: 'Tabela Estruturada',
        elements,
        frames: [frame],
      };
    }

    case 'timeline': {
      // ☡ Timeline & Roadmap
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '☡ Timeline Cronológica & Roadmap de Produto',
        x: originX,
        y: originY,
        width: 900,
        height: 440,
        backgroundColor: '#ffffff',
        borderColor: '#f59e0b',
        zIndex: 0,
      };

      const milestones = [
        { quarter: 'Q1: Fundação', color: '#3b82f6', items: ['• Core Canvas Engine', '• Formas & Conectores', '• Suporte Touch / Pan'] },
        { quarter: 'Q2: Colaboração', color: '#10b981', items: ['• Google Meet Integrado', '• Cursors em Tempo Real', '• Diorfy IA Copilot'] },
        { quarter: 'Q3: Escala', color: '#f59e0b', items: ['• Modelos Miro Nativos', '• Slide Motion Studio', '• Exportações Vetoriais'] },
        { quarter: 'Q4: Enterprise', color: '#8b5cf6', items: ['• Workspace SSO & RBAC', '• Multi-organizações', '• Integrações de API'] },
      ];

      const elements: CanvasElement[] = [];

      // Axis Line
      elements.push({
        id: uid('shape', 1),
        type: 'shape',
        x: originX + 40,
        y: originY + 90,
        width: 820,
        height: 6,
        zIndex: 1,
        content: '',
        createdAt: ts,
        style: {
          shapeType: 'rounded',
          backgroundColor: '#cbd5e1',
          borderWidth: 0,
        },
      });

      milestones.forEach((m, idx) => {
        const posX = originX + 40 + idx * 205;
        // Node marker
        elements.push({
          id: uid('shape', 10 + idx),
          type: 'shape',
          x: posX + 85,
          y: originY + 80,
          width: 26,
          height: 26,
          zIndex: 2,
          content: `${idx + 1}`,
          createdAt: ts,
          style: {
            shapeType: 'circle',
            backgroundColor: m.color,
            color: '#ffffff',
            fontSize: 12,
            borderWidth: 3,
            borderColor: '#ffffff',
            textAlign: 'center',
          },
        });

        // Header Pill
        elements.push({
          id: uid('shape', 20 + idx),
          type: 'shape',
          x: posX,
          y: originY + 30,
          width: 195,
          height: 38,
          zIndex: 2,
          content: m.quarter,
          createdAt: ts,
          style: {
            shapeType: 'pill',
            backgroundColor: m.color,
            color: '#ffffff',
            fontSize: 13,
            borderWidth: 0,
            textAlign: 'center',
          },
        });

        // Milestone card
        elements.push({
          id: uid('sticky', 30 + idx),
          type: 'sticky',
          x: posX,
          y: originY + 130,
          width: 195,
          height: 220,
          zIndex: 1,
          content: `🎯 Metas:\n\n${m.items.join('\n\n')}`,
          createdAt: ts,
          style: {
            backgroundColor: '#f8fafc',
            color: '#1e293b',
            fontSize: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
          },
        });
      });

      return {
        title: 'Timeline & Roadmap',
        elements,
        frames: [frame],
      };
    }

    case 'kanban': {
      // 🗂️ Kanban Board (To Do, In Progress, Done)
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '🗂️ Quadro Kanban de Sprint',
        x: originX,
        y: originY,
        width: 860,
        height: 520,
        backgroundColor: '#f8fafc',
        borderColor: '#3b82f6',
        zIndex: 0,
      };

      const columns = [
        { name: '📝 A Fazer (To Do)', color: '#eab308', bg: '#fef9c3', xOffset: 30 },
        { name: '⚡ Em Progresso', color: '#2563eb', bg: '#dbeafe', xOffset: 300 },
        { name: '✅ Concluído (Done)', color: '#16a34a', bg: '#dcfce7', xOffset: 570 },
      ];

      const elements: CanvasElement[] = [];

      columns.forEach((col, idx) => {
        // Column Header
        elements.push({
          id: uid('shape', 1 + idx),
          type: 'shape',
          x: originX + col.xOffset,
          y: originY + 40,
          width: 255,
          height: 45,
          zIndex: 1,
          content: col.name,
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: col.bg,
            color: col.color,
            borderColor: col.color,
            borderWidth: 2,
            fontSize: 14,
            textAlign: 'center',
          },
        });
      });

      // To Do Cards
      elements.push({
        id: uid('sticky', 10),
        type: 'sticky',
        x: originX + 30,
        y: originY + 100,
        width: 255,
        height: 120,
        zIndex: 2,
        content: '📌 Pesquisar novos plugins e exportação SVG 4K',
        createdAt: ts,
        style: { backgroundColor: '#fef08a', color: '#1e293b', fontSize: 13 },
      });
      elements.push({
        id: uid('sticky', 11),
        type: 'sticky',
        x: originX + 30,
        y: originY + 235,
        width: 255,
        height: 120,
        zIndex: 2,
        content: '📌 Gravar vídeo tutorial com a ferramenta Talktrack',
        createdAt: ts,
        style: { backgroundColor: '#fef08a', color: '#1e293b', fontSize: 13 },
      });

      // In Progress Cards
      elements.push({
        id: uid('sticky', 20),
        type: 'sticky',
        x: originX + 300,
        y: originY + 100,
        width: 255,
        height: 120,
        zIndex: 2,
        content: '🔥 Refatorar menu de criação com os 9 modelos nativos do Miro',
        createdAt: ts,
        style: { backgroundColor: '#bae6fd', color: '#1e293b', fontSize: 13 },
      });

      // Done Cards
      elements.push({
        id: uid('sticky', 30),
        type: 'sticky',
        x: originX + 570,
        y: originY + 100,
        width: 255,
        height: 120,
        zIndex: 2,
        content: '🎉 Google Meet Integrado e Sincronização em tempo real',
        createdAt: ts,
        style: { backgroundColor: '#bbf7d0', color: '#1e293b', fontSize: 13 },
      });
      elements.push({
        id: uid('sticky', 31),
        type: 'sticky',
        x: originX + 570,
        y: originY + 235,
        width: 255,
        height: 120,
        zIndex: 2,
        content: '🎉 Sistema de Atalhos e Preferências Personalizadas',
        createdAt: ts,
        style: { backgroundColor: '#bbf7d0', color: '#1e293b', fontSize: 13 },
      });

      return {
        title: 'Quadro Kanban',
        elements,
        frames: [frame],
      };
    }

    case 'document': {
      // 📄 Document / Product Spec
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '📄 Documento de Especificação & Briefing',
        x: originX,
        y: originY,
        width: 680,
        height: 640,
        backgroundColor: '#ffffff',
        borderColor: '#64748b',
        zIndex: 0,
      };

      const elements: CanvasElement[] = [
        // Title Header
        {
          id: uid('shape', 1),
          type: 'shape',
          x: originX + 35,
          y: originY + 30,
          width: 610,
          height: 60,
          zIndex: 1,
          content: '📄 Product Requirements Document (PRD)\nProjeto: Nova Experiência Diorfy Workspace',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontSize: 16,
            borderWidth: 0,
            textAlign: 'left',
          },
        },
        // Meta badges
        {
          id: uid('shape', 2),
          type: 'shape',
          x: originX + 35,
          y: originY + 100,
          width: 610,
          height: 40,
          zIndex: 1,
          content: '👤 Autor: Equipe de Produto  |  📅 Versão: 2.4.0  |  🟢 Status: Aprovado',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#f1f5f9',
            color: '#475569',
            fontSize: 12,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            textAlign: 'left',
          },
        },
        // Executive Summary
        {
          id: uid('sticky', 3),
          type: 'sticky',
          x: originX + 35,
          y: originY + 155,
          width: 290,
          height: 190,
          zIndex: 1,
          content: '🎯 Objetivo Principal:\n\nProporcionar a melhor experiência de quadro branco infinito com ferramentas nativas inspiradas nos melhores fluxos do Miro.',
          createdAt: ts,
          style: {
            backgroundColor: '#fef08a',
            color: '#1e293b',
            fontSize: 13,
          },
        },
        // Key Deliverables
        {
          id: uid('sticky', 4),
          type: 'sticky',
          x: originX + 355,
          y: originY + 155,
          width: 290,
          height: 190,
          zIndex: 1,
          content: '🚀 Entregas Principais:\n\n1. Menu de criação com 9 modelos\n2. Integração ágil do Google Meet\n3. Animações e exportação rica\n4. Colaboração em tempo real',
          createdAt: ts,
          style: {
            backgroundColor: '#bae6fd',
            color: '#1e293b',
            fontSize: 13,
          },
        },
        // Architecture & Notes
        {
          id: uid('shape', 5),
          type: 'shape',
          x: originX + 35,
          y: originY + 360,
          width: 610,
          height: 230,
          zIndex: 1,
          content: '💡 Critérios de Aceite & Segurança:\n\n• Suporte total a touch, caneta stylus e gestos de pinça.\n• Renderização fluida a 60 FPS mesmo com centenas de elementos.\n• Sincronização multi-aba sem latência.\n• Responsividade completa para telas desktop, tablets e smartphones.',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#f8fafc',
            borderColor: '#cbd5e1',
            borderWidth: 1,
            color: '#334155',
            fontSize: 13,
            textAlign: 'left',
          },
        },
      ];

      return {
        title: 'Documento PRD',
        elements,
        frames: [frame],
      };
    }

    case 'slides': {
      // 📽️ Multi-Slide Presentation Deck
      const frames: CanvasFrame[] = [
        {
          id: uid('frame', 1),
          title: '📽️ Slide 1: Visão Geral & Capa',
          x: originX,
          y: originY,
          width: 480,
          height: 290,
          backgroundColor: '#0f172a',
          borderColor: '#8b5cf6',
          zIndex: 0,
        },
        {
          id: uid('frame', 2),
          title: '📽️ Slide 2: Problema & Oportunidade',
          x: originX + 510,
          y: originY,
          width: 480,
          height: 290,
          backgroundColor: '#ffffff',
          borderColor: '#8b5cf6',
          zIndex: 0,
        },
        {
          id: uid('frame', 3),
          title: '📽️ Slide 3: Estratégia & Métricas',
          x: originX + 1020,
          y: originY,
          width: 480,
          height: 290,
          backgroundColor: '#ffffff',
          borderColor: '#8b5cf6',
          zIndex: 0,
        },
      ];

      const elements: CanvasElement[] = [
        // Slide 1 elements
        {
          id: uid('shape', 10),
          type: 'shape',
          x: originX + 30,
          y: originY + 60,
          width: 420,
          height: 160,
          zIndex: 1,
          content: '✨ Diorfy Presentation\n\nRevolução em Quadros Colaborativos\nApresentado por: Equipe de Produto',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            fontSize: 16,
            borderWidth: 0,
            textAlign: 'center',
          },
        },
        // Slide 2 elements
        {
          id: uid('sticky', 20),
          type: 'sticky',
          x: originX + 540,
          y: originY + 50,
          width: 200,
          height: 180,
          zIndex: 1,
          content: '⚠️ O Desafio:\n\nFerramentas lentas, isoladas e que não conectam reuniões ao canvas.',
          createdAt: ts,
          style: { backgroundColor: '#fef08a', color: '#1e293b', fontSize: 13 },
        },
        {
          id: uid('sticky', 21),
          type: 'sticky',
          x: originX + 760,
          y: originY + 50,
          width: 200,
          height: 180,
          zIndex: 1,
          content: '💡 A Solução:\n\nQuadro com IA, Google Meet integrado, 9 modelos Miro e 60 FPS.',
          createdAt: ts,
          style: { backgroundColor: '#bbf7d0', color: '#1e293b', fontSize: 13 },
        },
        // Slide 3 elements
        {
          id: uid('shape', 30),
          type: 'shape',
          x: originX + 1050,
          y: originY + 50,
          width: 420,
          height: 190,
          zIndex: 1,
          content: '🚀 Próximos Passos & Métricas:\n\n• Lançamento Beta: 100% dos fluxos Miro\n• Retenção esperada: +45%\n• Engajamento da equipe: 3x mais colaboração',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#eff6ff',
            borderColor: '#3b82f6',
            borderWidth: 2,
            color: '#1e40af',
            fontSize: 14,
            textAlign: 'left',
          },
        },
      ];

      return {
        title: 'Slides de Apresentação',
        elements,
        frames,
      };
    }

    case 'engage': {
      // 🎯 Engage Activities (Icebreakers, Voting, Retro)
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '🎯 Atividades do Engage: Dinâmicas & Votação',
        x: originX,
        y: originY,
        width: 860,
        height: 480,
        backgroundColor: '#fff7ed',
        borderColor: '#ea580c',
        zIndex: 0,
      };

      const elements: CanvasElement[] = [
        // Icebreaker Header
        {
          id: uid('shape', 1),
          type: 'shape',
          x: originX + 30,
          y: originY + 30,
          width: 380,
          height: 45,
          zIndex: 1,
          content: '🧊 Quebra-Gelo: O que te inspirou hoje?',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#fed7aa',
            color: '#9a3412',
            fontSize: 13,
            borderWidth: 0,
            textAlign: 'center',
          },
        },
        // Retro Header
        {
          id: uid('shape', 2),
          type: 'shape',
          x: originX + 450,
          y: originY + 30,
          width: 380,
          height: 45,
          zIndex: 1,
          content: '🔄 Retrospectiva: Start / Stop / Continue',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#fbcfe8',
            color: '#9d174d',
            fontSize: 13,
            borderWidth: 0,
            textAlign: 'center',
          },
        },
        // Icebreaker stickies
        {
          id: uid('sticky', 10),
          type: 'sticky',
          x: originX + 30,
          y: originY + 90,
          width: 180,
          height: 150,
          zIndex: 1,
          content: '🌟 "Aprender uma nova técnica de design vetorial no Figma!"',
          createdAt: ts,
          style: { backgroundColor: '#fef08a', color: '#1e293b', fontSize: 13 },
        },
        {
          id: uid('sticky', 11),
          type: 'sticky',
          x: originX + 230,
          y: originY + 90,
          width: 180,
          height: 150,
          zIndex: 1,
          content: '🚀 "A agilidade do time no último deploy!"',
          createdAt: ts,
          style: { backgroundColor: '#bbf7d0', color: '#1e293b', fontSize: 13 },
        },
        // Retro stickies
        {
          id: uid('sticky', 20),
          type: 'sticky',
          x: originX + 450,
          y: originY + 90,
          width: 180,
          height: 150,
          zIndex: 1,
          content: '🟢 START:\nRealizar dailies curtas de 10 min no Google Meet.',
          createdAt: ts,
          style: { backgroundColor: '#bbf7d0', color: '#1e293b', fontSize: 13 },
        },
        {
          id: uid('sticky', 21),
          type: 'sticky',
          x: originX + 650,
          y: originY + 90,
          width: 180,
          height: 150,
          zIndex: 1,
          content: '🔴 STOP:\nReuniões sem pauta ou sem quadro de anotações.',
          createdAt: ts,
          style: { backgroundColor: '#fecdd3', color: '#1e293b', fontSize: 13 },
        },
        // Voting callout
        {
          id: uid('shape', 30),
          type: 'shape',
          x: originX + 30,
          y: originY + 270,
          width: 800,
          height: 170,
          zIndex: 1,
          content: '🗳️ Área de Votação Interativa\n\nCole stickers de reações (👍, ⭐, 🔥, ❤️) nos post-its para votar nas melhores ideias da Sprint!',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#ffffff',
            borderColor: '#fdba74',
            borderWidth: 2,
            color: '#c2410c',
            fontSize: 14,
            textAlign: 'center',
          },
        },
      ];

      return {
        title: 'Atividades do Engage',
        elements,
        frames: [frame],
      };
    }

    case 'talktrack': {
      // 📹 Talktrack Interactive Recording & Audio/Video Walkthrough
      const frameId = uid('frame', 0);
      const frame: CanvasFrame = {
        id: frameId,
        title: '📹 Talktrack: Gravação Interativa do Quadro',
        x: originX,
        y: originY,
        width: 680,
        height: 440,
        backgroundColor: '#0f172a',
        borderColor: '#06b6d4',
        zIndex: 0,
      };

      const elements: CanvasElement[] = [
        // Video / Avatar Bubble Preview
        {
          id: uid('shape', 1),
          type: 'shape',
          x: originX + 30,
          y: originY + 40,
          width: 200,
          height: 200,
          zIndex: 2,
          content: '👤\nMariana Silva\n[Gravação Ativa]',
          createdAt: ts,
          style: {
            shapeType: 'circle',
            backgroundColor: '#0891b2',
            color: '#ffffff',
            fontSize: 14,
            borderWidth: 4,
            borderColor: '#22d3ee',
            textAlign: 'center',
          },
        },
        // Talktrack Player Controls
        {
          id: uid('shape', 2),
          type: 'shape',
          x: originX + 250,
          y: originY + 40,
          width: 400,
          height: 200,
          zIndex: 1,
          content: '🎙️ Talktrack: Visão Geral do Roadmap\n\n⏱️ Duração: 02:45 min  •  1080p HD\n\n▶️ [Reproduzir]   ⏸️ [Pausar]   🔄 [Reiniciar]\n\n"Nesta gravação explico os principais pontos da arquitetura do canvas."',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            fontSize: 13,
            borderWidth: 1,
            borderColor: '#334155',
            textAlign: 'left',
          },
        },
        // Audio Waveform representation
        {
          id: uid('shape', 3),
          type: 'shape',
          x: originX + 30,
          y: originY + 260,
          width: 620,
          height: 60,
          zIndex: 1,
          content: ' ▂▃▅▆▇▆▅▃▂ ▂▃▅▆▇█▇▆▅▃▂  ▂▃▅▆▇▆▅▃▂ ▂▃▅▆▇█▇▆▅▃▂  (01:14 / 02:45)',
          createdAt: ts,
          style: {
            shapeType: 'rounded',
            backgroundColor: '#164e63',
            color: '#22d3ee',
            fontSize: 14,
            borderWidth: 0,
            textAlign: 'center',
          },
        },
        // Comments & Transcript note
        {
          id: uid('sticky', 4),
          type: 'sticky',
          x: originX + 30,
          y: originY + 340,
          width: 620,
          height: 70,
          zIndex: 1,
          content: '💬 Transcrição IA: "O quadro agora conta com os 9 modelos nativos, permitindo criar protótipos, diagramas e roadmaps em 1 clique."',
          createdAt: ts,
          style: {
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            fontSize: 12,
          },
        },
      ];

      return {
        title: 'Talktrack Walkthrough',
        elements,
        frames: [frame],
      };
    }

    default:
      return {
        title: 'Modelo',
        elements: [],
        frames: [],
      };
  }
}
